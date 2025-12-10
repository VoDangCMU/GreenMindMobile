
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/store/todoStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { useTodoStore } from "@/store/todoStore";
import generate_subtasks from "@/apis/ai/todos/todo_generator";
import { useTodoAffect } from "@/hooks/metric/useTodoAffect";
import { createTodo, getTodos, batchCreateTodos, deleteTodo as deleteTodoAPI, updateTodo as updateTodoAPI, type TodoData } from "@/apis/backend/v1/todo";
import { useMetricFeedbackStore } from "@/store/v2/metricFeedbackStore";
import { MetricFeedbackCard } from "@/components/app-components/MetricFeedbackCard";
import AppHeaderButton from "@/components/common/AppHeaderButton";
import {
  Plus,
  Circle,
  Lightbulb,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

import { TodoItemComponent } from "@/components/app-components/page-components/todo/TodoItem";
import BottomNav from "@/components/app-components/page-components/home/HomeBottomNav";
import OceanPersonalityCard from "@/components/app-components/commons/OceanPersonalityCard";

export default function TodoPage() {
  const { todos, addTodo, addSubtask, removeTodo, setTodos } = useTodoStore();

  const user = useAuthStore((state) => state.user);
  const todoFeedback = useMetricFeedbackStore((s) => s.getFeedback("list_adherence"));
  const [showFeedback, setShowFeedback] = useState(false);

  const [newTodoText, setNewTodoText] = useState("");
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [newChildText, setNewChildText] = useState("");
  const [_loading, setLoading] = useState(false);

  // Convert backend TodoData to local Todo format
  const convertTodoData = (todoData: TodoData): Todo => ({
    id: todoData.id,
    title: todoData.title,
    completed: todoData.completed,
    children: todoData.subtasks?.map(convertTodoData) || [],
    parent: todoData.parent_id || undefined,
  });

  // Fetch todos from backend on mount
  useEffect(() => {
    const fetchTodosFromBackend = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await getTodos();
        const backendTodos = response.data.data.map(convertTodoData);
        setTodos(backendTodos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodosFromBackend();
  }, []);

  // Count all todos recursively
  const countAllTodos = (items: Todo[]): number => {
    return items.length + items.reduce((sum: number, item: Todo) => sum + countAllTodos(item.children), 0);
  };

  const countCompletedTodos = (items: Todo[]): number => {
    const completed = items.filter((item: Todo) => item.completed).length;
    const childrenCompleted = items.reduce((sum: number, item: Todo) => sum + countCompletedTodos(item.children), 0);
    return completed + childrenCompleted;
  };

  // Add main todo
  const addMainTodo = async () => {
    if (!newTodoText.trim() || !user?.id) return;
    setLoading(true);
    try {
      const response = await createTodo({
        title: newTodoText,
        parent_id: null,
        completed: false,
      });
      const newTodo = convertTodoData(response.data.data);
      addTodo(newTodo);
      setNewTodoText("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion
  const { callTodoAffect } = useTodoAffect();

  const toggleTodo = async (id: string) => {
    // Helper to find todo and its descendants
    const findTodoAndDescendants = (items: Todo[], targetId: string): { target: Todo | null, descendants: Todo[] } => {
      for (const item of items) {
        if (item.id === targetId) {
          const descendants: Todo[] = [];
          const collectDescendants = (node: Todo) => {
            for (const child of node.children) {
              descendants.push(child);
              collectDescendants(child);
            }
          };
          collectDescendants(item);
          return { target: item, descendants };
        }
        const result = findTodoAndDescendants(item.children, targetId);
        if (result.target) return result;
      }
      return { target: null, descendants: [] };
    };

    const { target, descendants } = findTodoAndDescendants(todos, id);
    if (!target) return;

    const newCompletedStatus = !target.completed;
    const todosToUpdate = [target, ...descendants];

    try {
      // Update all todos in parallel
      await Promise.all(todosToUpdate.map(todo =>
        updateTodoAPI(todo.id, { completed: newCompletedStatus })
      ));

      // Update local store recursively
      const updateTodosRecursively = (items: Todo[]): Todo[] => {
        return items.map(item => {
          const shouldUpdate = todosToUpdate.some(t => t.id === item.id);
          const newItem = shouldUpdate ? { ...item, completed: newCompletedStatus } : item;
          if (item.children.length > 0) {
            newItem.children = updateTodosRecursively(item.children);
          }
          return newItem;
        });
      };

      const newTodos = updateTodosRecursively(todos);
      setTodos(newTodos);

      // Prepare data for the list_adherence API - only top level tasks
      const flattenTodos = (items: Todo[]): Array<{ task: string; done: boolean }> => {
        return items.map(item => ({
          task: item.title,
          done: item.completed
        }));
      };

      const flatTodos = flattenTodos(newTodos);

      // Call useTodoAffect to update OCEAN scores
      await callTodoAffect(flatTodos);

    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  // Toggle expand/collapse
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoAPI(id);
      removeTodo(id);
      if (editingParentId === id) setEditingParentId(null);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Add child todo
  const addChildTodo = async (parentId: string, text: string) => {
    if (!text.trim() || !user?.id) return;

    try {
      const response = await createTodo({
        title: text,
        parent_id: parentId,
        completed: false,
      });
      const newTodo = convertTodoData(response.data.data);
      addSubtask(parentId, newTodo);
    } catch (error) {
      console.error("Failed to create subtask:", error);
    }
  };

  // Track generating states
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  // Generate AI subtasks
  const handleGenerateSubtasks = async (parentId: string, todoTitle: string) => {
    if (!user?.id) return;

    setGeneratingIds(prev => new Set(prev).add(parentId));
    try {
      const response = await generate_subtasks({ task: todoTitle });

      const subtasks = response.subtasks.map((task: string) => ({
        title: task.replace('*   ', ''),
        completed: false,
      }));

      await batchCreateTodos({
        parent_id: parentId,
        todos: subtasks,
      });

      // Refresh todos to get the updated data
      const todosResponse = await getTodos();
      const backendTodos = todosResponse.data.data.map(convertTodoData);
      setTodos(backendTodos);

    } catch (error) {
      console.error("Failed to generate subtasks:", error);
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(parentId);
        return next;
      });
    }
  };

  const totalTodos = countAllTodos(todos);
  const completedTodos = countCompletedTodos(todos);

  return (
    <SafeAreaLayout
      header={<AppHeader showBack title="Todo" rightActions={todoFeedback ? [
        <AppHeaderButton
          key="feedback"
          icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
          onClick={() => setShowFeedback(!showFeedback)}
        />
      ] : []} />}
      footer={<BottomNav></BottomNav>}
    >
      <div className="max-w-sm mx-auto pl-4 pr-4 pb-8 space-y-4">
        {/* Show feedback card if available */}
        {showFeedback && todoFeedback && (
          <MetricFeedbackCard feedback={todoFeedback} />
        )}
        
        <OceanPersonalityCard />
        {/* Stats Card */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-greenery-50 to-blue-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-greenery-600">
                {completedTodos}/{totalTodos}
              </p>
              <p className="text-xs text-gray-600">Total Items Completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Add Main Todo */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new todo..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addMainTodo()}
                className="text-sm"
              />
              <Button
                onClick={addMainTodo}
                className="bg-greenery-500 hover:bg-greenery-600 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todos Tree */}
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItemComponent
              key={todo.id}
              item={todo}
              level={0}
              onToggle={toggleTodo}
              onToggleExpand={toggleExpand}
              onDelete={deleteTodo}
              onAddChild={addChildTodo}
              onGenerateSubtasks={handleGenerateSubtasks}
              editingParentId={editingParentId}
              newChildText={newChildText}
              setNewChildText={setNewChildText}
              setEditingParentId={setEditingParentId}
              expandedIds={expandedIds}
              setExpandedIds={setExpandedIds}
              generatingIds={generatingIds}
            />
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Circle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">Không có công việc nào</p>
            <p className="text-gray-400 text-sm">
              Tạo một công việc mới để bắt đầu
            </p>
          </div>
        )}
      </div>
    </SafeAreaLayout>
  );
}

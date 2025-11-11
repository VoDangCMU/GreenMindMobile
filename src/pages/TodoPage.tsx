/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/store/todoStore";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { useTodoStore } from "@/store/todoStore";
import generate_subtasks from "@/apis/ai/todos/todo_generator";
import list_adherence from "@/apis/ai/monitor_ocean/list_adherence";
import { useAppStore } from "@/store/appStore";
import { useOceanUpdate } from "@/hooks/useOceanUpdate";
import { createTodo, getTodos, batchCreateTodos, deleteTodo as deleteTodoAPI, toggleTodo as toggleTodoAPI, type TodoData } from "@/apis/backend/todo";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  Wand2,
  Loader2,
} from "lucide-react";
import type { OceanScore } from "@/apis/ai/monitor_ocean";

type TodoItemProps = {
  item: Todo;
  level: number;
  onToggle: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, text: string) => void;
  onGenerateSubtasks: (parentId: string, todoTitle: string) => void;
  editingParentId: string | null;
  newChildText: string;
  setNewChildText: (text: string) => void;
  setEditingParentId: (id: string | null) => void;
  expandedIds: Set<string>;
  setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  generatingIds?: Set<string>;
};

function TodoItemComponent({
  item,
  level,
  onToggle,
  onToggleExpand,
  onDelete,
  onAddChild,
  onGenerateSubtasks,
  editingParentId,
  newChildText,
  setNewChildText,
  setEditingParentId,
  expandedIds,
  setExpandedIds,
  generatingIds,
}: TodoItemProps) {
  const paddingLeft = level * 16;

  const countTotalChildren = (node: Todo): number => {
    return node.children.length + node.children.reduce((sum: number, child: Todo) => sum + countTotalChildren(child), 0);
  };

  const countCompletedChildren = (node: Todo): number => {
    const completed = node.children.filter((child: Todo) => child.completed).length;
    const childrenCompleted = node.children.reduce((sum: number, child: Todo) => sum + countCompletedChildren(child), 0);
    return completed + childrenCompleted;
  };

  const totalChildren = countTotalChildren(item);
  const completedChildren = countCompletedChildren(item);

  return (
    <div key={item.id} className="space-y-2">
      {/* Todo Item Card */}
      <Card
        className="border-0 shadow-sm hover:shadow-md transition"
        style={{ marginLeft: `${paddingLeft}px` }}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggle(item.id)}
              className="flex-shrink-0"
              style={{
                color: level === 0 ? "#15803d" : "#3b82f6",
              }}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            {/* Todo Text */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium break-words ${
                  item.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {item.title}
              </p>
              {totalChildren > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {completedChildren}/{totalChildren} items
                </p>
              )}
            </div>

              {/* Expand/Collapse Button */}
            {item.children.length > 0 && (
              <button
                onClick={() => onToggleExpand(item.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                {expandedIds.has(item.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Add Sub-Todo Button */}
            <button
              onClick={() => {
                if (!expandedIds.has(item.id)) {
                  setExpandedIds(prev => new Set(prev).add(item.id));
                }
                setEditingParentId(item.id);
              }}
              className="flex-shrink-0 text-blue-400 hover:text-blue-600"
              title="Add sub-todo"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* AI Generate Button */}
            <button
              onClick={() => onGenerateSubtasks(item.id, item.title)}
              className={`flex-shrink-0 ${generatingIds?.has(item.id) ? 'text-purple-600' : 'text-purple-400 hover:text-purple-600'}`}
              title="Generate AI subtasks"
              disabled={generatingIds?.has(item.id)}
            >
              {generatingIds?.has(item.id) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(item.id)}
              className="flex-shrink-0 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Children - Expanded */}
      {expandedIds.has(item.id) && item.children.length > 0 && (
        <div className="space-y-2">
          {item.children.map((child: Todo) => (
            <TodoItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              onToggleExpand={onToggleExpand}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onGenerateSubtasks={onGenerateSubtasks}
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
      )}

      {/* Add Child Todo - Show when expanded */}
  {expandedIds.has(item.id) && (
        <div style={{ marginLeft: `${paddingLeft + 16}px` }}>
          <Card className="shadow-sm border border-dashed border-gray-300">
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add sub-todo..."
                  value={editingParentId === item.id ? newChildText : ""}
                  onChange={(e) => setNewChildText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onAddChild(item.id, newChildText);
                      setNewChildText("");
                      setEditingParentId(null);
                    }
                  }}
                  onFocus={() => setEditingParentId(item.id)}
                  className="text-sm"
                />
                <Button
                  onClick={() => {
                    onAddChild(item.id, newChildText);
                    setNewChildText("");
                    setEditingParentId(null);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function TodoPage() {
  const { todos, addTodo, addSubtask, toggleComplete, removeTodo, setTodos } = useTodoStore();
  const { updateOcean } = useOceanUpdate();
  const ocean = useAppStore((state) => state.ocean);
  const user = useAppStore((state) => state.user);

  const [newTodoText, setNewTodoText] = useState("");
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [newChildText, setNewChildText] = useState("");
  const [loading, setLoading] = useState(false);

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
  const toggleTodo = async (id: string) => {
    try {
      await toggleTodoAPI(id);
      toggleComplete(id);

      // Prepare data for the list_adherence API - only top level tasks
      const flattenTodos = (items: Todo[]): Array<{ task: string; done: boolean }> => {
        return items.map(item => ({
          task: item.title,
          done: item.completed
        }));
      };

      const normalizeOceanScores = ({ O, C, E, A, N }: OceanScore) => ({
        O: O / 100,
        C: C / 100,
        E: E / 100,
        A: A / 100,
        N: N / 100
      });

      const flatTodos = flattenTodos(todos);
      if (!ocean) {
        console.error("No OCEAN scores available");
        return;
      }
      // Call list_adherence first to calculate new scores
      const response = await list_adherence({
        todos: flatTodos,
        base_likert: 4, // Default base likert scale
        weight: 0.3,   // Default weight
        direction: "up", // Default direction
        sigma_r: 1.0,  // Default sigma
        alpha: 0.5,   // Default alpha
        ocean_score: normalizeOceanScores(ocean)
      });

      // Update the OCEAN scores with the new values from list_adherence
      await updateOcean(response.new_ocean_score);
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
    <SafeAreaLayout header={<AppHeader showBack title="Todo" />}>
      <div className="max-w-sm mx-auto pl-4 pr-4 pb-8 space-y-4">
        {/* OCEAN Score Compact
        <Card className="border-0 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-greenery-600" />
                <span className="text-sm font-medium">OCEAN Score</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {ocean && Object.entries(ocean).map(([trait, value]) => (
                <div
                  key={trait}
                  className="flex flex-col items-center"
                >
                  <div className="w-2 h-16 bg-gray-200 relative rounded-sm overflow-hidden mb-1">
                    <div
                      className="bg-greenery-500 w-full absolute bottom-0 transition-all duration-300"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-gray-600">{trait}</span>
                  <span className="text-[10px] text-gray-500">{Number(value).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

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

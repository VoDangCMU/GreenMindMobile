"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  children: TodoItem[];
  expanded: boolean;
}

// Recursive Todo Item Component
interface TodoItemProps {
  item: TodoItem;
  level: number;
  onToggle: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string, text: string) => void;
  editingParentId: string | null;
  newChildText: string;
  setNewChildText: (text: string) => void;
  setEditingParentId: (id: string | null) => void;
}

function TodoItemComponent({
  item,
  level,
  onToggle,
  onToggleExpand,
  onDelete,
  onAddChild,
  editingParentId,
  newChildText,
  setNewChildText,
  setEditingParentId,
}: TodoItemProps) {
  const paddingLeft = level * 16;

  const countTotalChildren = (node: TodoItem): number => {
    return node.children.length + node.children.reduce((sum, child) => sum + countTotalChildren(child), 0);
  };

  const countCompletedChildren = (node: TodoItem): number => {
    const completed = node.children.filter((child) => child.completed).length;
    const childrenCompleted = node.children.reduce((sum, child) => sum + countCompletedChildren(child), 0);
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
                {item.text}
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
                {item.expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Add Sub-Todo Button */}
            <button
              onClick={() => {
                onToggleExpand(item.id);
                setEditingParentId(item.id);
              }}
              className="flex-shrink-0 text-blue-400 hover:text-blue-600"
              title="Add sub-todo"
            >
              <Plus className="w-4 h-4" />
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
      {item.expanded && item.children.length > 0 && (
        <div className="space-y-2">
          {item.children.map((child) => (
            <TodoItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onToggle={onToggle}
              onToggleExpand={onToggleExpand}
              onDelete={onDelete}
              onAddChild={onAddChild}
              editingParentId={editingParentId}
              newChildText={newChildText}
              setNewChildText={setNewChildText}
              setEditingParentId={setEditingParentId}
            />
          ))}
        </div>
      )}

      {/* Add Child Todo - Show when expanded */}
      {item.expanded && (
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
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "1",
      text: "Setup Development Environment",
      completed: false,
      expanded: true,
      children: [
        {
          id: "1-1",
          text: "Install Node.js",
          completed: true,
          expanded: false,
          children: [],
        },
        {
          id: "1-2",
          text: "Clone repository",
          completed: true,
          expanded: true,
          children: [
            {
              id: "1-2-1",
              text: "Navigate to project folder",
              completed: true,
              expanded: false,
              children: [],
            },
          ],
        },
        {
          id: "1-3",
          text: "Install dependencies",
          completed: false,
          expanded: false,
          children: [],
        },
      ],
    },
  ]);

  const [newTodoText, setNewTodoText] = useState("");
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [newChildText, setNewChildText] = useState("");

  // Count all todos recursively
  const countAllTodos = (items: TodoItem[]): number => {
    return items.length + items.reduce((sum, item) => sum + countAllTodos(item.children), 0);
  };

  const countCompletedTodos = (items: TodoItem[]): number => {
    const completed = items.filter((item) => item.completed).length;
    const childrenCompleted = items.reduce((sum, item) => sum + countCompletedTodos(item.children), 0);
    return completed + childrenCompleted;
  };

  // Add main todo
  const addMainTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText,
        completed: false,
        children: [],
        expanded: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText("");
    }
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    const toggleInTree = (items: TodoItem[]): TodoItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completed: !item.completed,
            children: item.children.map((child) => ({
              ...child,
              completed: !item.completed,
            })),
          };
        }
        return {
          ...item,
          children: toggleInTree(item.children),
        };
      });
    };
    setTodos(toggleInTree(todos));
  };

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    const toggleInTree = (items: TodoItem[]): TodoItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, expanded: !item.expanded };
        }
        return {
          ...item,
          children: toggleInTree(item.children),
        };
      });
    };
    setTodos(toggleInTree(todos));
  };

  // Delete todo
  const deleteTodo = (id: string) => {
    const deleteInTree = (items: TodoItem[]): TodoItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: deleteInTree(item.children),
        }));
    };
    setTodos(deleteInTree(todos));
    if (editingParentId === id) setEditingParentId(null);
  };

  // Add child todo
  const addChildTodo = (parentId: string, text: string) => {
    if (!text.trim()) return;

    const addInTree = (items: TodoItem[]): TodoItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [
              ...item.children,
              {
                id: `${parentId}-${Date.now()}`,
                text,
                completed: false,
                children: [],
                expanded: false,
              },
            ],
          };
        }
        return {
          ...item,
          children: addInTree(item.children),
        };
      });
    };
    setTodos(addInTree(todos));
  };

  const totalTodos = countAllTodos(todos);
  const completedTodos = countCompletedTodos(todos);

  return (
    <SafeAreaLayout header={<AppHeader showBack title="Todo" />}>
      <div className="max-w-sm mx-auto pl-4 pr-4 pb-8 space-y-4">
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
              editingParentId={editingParentId}
              newChildText={newChildText}
              setNewChildText={setNewChildText}
              setEditingParentId={setEditingParentId}
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

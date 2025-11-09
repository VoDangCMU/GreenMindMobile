import { create } from 'zustand';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  children: Todo[];
  parent?: string; // Parent todo ID
}

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  addSubtask: (parentId: string, subtask: Todo) => void;
  toggleComplete: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo]
    })),
    
  addSubtask: (parentId, subtask) =>
    set((state) => ({
      todos: addSubtaskToTodo(state.todos, parentId, subtask)
    })),
    
  toggleComplete: (id) =>
    set((state) => ({
      todos: toggleTodoComplete(state.todos, id)
    })),
    
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter(todo => todo.id !== id)
    })),
    
  updateTodo: (id, updates) =>
    set((state) => ({
      todos: updateTodoById(state.todos, id, updates)
    }))
}));

// Helper functions
function addSubtaskToTodo(todos: Todo[], parentId: string, subtask: Todo): Todo[] {
  return todos.map(todo => {
    if (todo.id === parentId) {
      return {
        ...todo,
        children: [...todo.children, subtask]
      };
    }
    if (todo.children.length > 0) {
      return {
        ...todo,
        children: addSubtaskToTodo(todo.children, parentId, subtask)
      };
    }
    return todo;
  });
}

function toggleTodoComplete(todos: Todo[], id: string): Todo[] {
  return todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        completed: !todo.completed
      };
    }
    if (todo.children.length > 0) {
      return {
        ...todo,
        children: toggleTodoComplete(todo.children, id)
      };
    }
    return todo;
  });
}

function updateTodoById(todos: Todo[], id: string, updates: Partial<Todo>): Todo[] {
  return todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        ...updates
      };
    }
    if (todo.children.length > 0) {
      return {
        ...todo,
        children: updateTodoById(todo.children, id, updates)
      };
    }
    return todo;
  });
}
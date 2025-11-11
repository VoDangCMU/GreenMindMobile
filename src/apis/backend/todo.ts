import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export interface TodoCreateParams {
  title: string;
  parent_id: string | null;
  completed?: boolean;
}

export interface TodoBatchParams {
  parent_id?: string | null;
  todos: Array<{
    title: string;
    completed: boolean;
    parent_id?: string | null;
  }>;
}

export interface TodoUpdateParams {
  title?: string;
  completed?: boolean;
  parent_id?: string | null;
}

export interface TodoData {
  id: string;
  title: string;
  completed: boolean;
  parent_id: string | null;
  user_id: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedItems?: number;
  totalItems?: number;
  subtasks?: TodoData[];
}

export interface TodoCreateResponse {
  message: string;
  data: TodoData;
}

export interface TodoGetResponse {
  message: string;
  data: TodoData[];
}

export interface TodoBatchResponse {
  message: string;
  data: TodoData[];
}

export async function createTodo(params: TodoCreateParams) {
  return BackendInstance.post<TodoCreateResponse>("/todos", params, { headers: authHeader() });
}

export async function getTodos() {
  return BackendInstance.get<TodoGetResponse>("/todos", { headers: authHeader() });
}

export async function batchCreateTodos(params: TodoBatchParams) {
  return BackendInstance.post<TodoBatchResponse>("/todos/batch", params, { headers: authHeader() });
}

export async function updateTodo(id: string, params: TodoUpdateParams) {
  return BackendInstance.put(`/todos/${id}`, params, { headers: authHeader() });
}

export async function deleteTodo(id: string) {
  return BackendInstance.delete(`/todos/${id}`, { headers: authHeader() });
}

export async function toggleTodo(id: string) {
  return BackendInstance.patch(`/todos/${id}/toggle`, {}, { headers: authHeader() });
}

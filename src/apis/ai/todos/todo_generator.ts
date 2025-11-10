import AIApi from "@/apis/instances/AIInstance";

export interface ITodoBehavior {
    task: string;
}

export interface IGeneratedSubTodos {
    task:     string;
    subtasks: string[];
}

export default async function generate_subtasks(data: ITodoBehavior) {
  return AIApi.post('/generate_subtasks', data).then(res => res.data as IGeneratedSubTodos);
}
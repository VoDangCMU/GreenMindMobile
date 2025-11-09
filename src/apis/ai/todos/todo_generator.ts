import AIApi from "@/apis/instances/AIInstance";

export interface ITodoBehavior {
    task: string;
}

export interface IGeneratedSubTodos {
    task:     string;
    subtasks: string[];
}

const example_response = {
    "task": "Đi chơi Đà Nẵng",
    "subtasks": [
        "*   Lên kế hoạch (thời gian, ngân sách, người đi cùng)",
        "*   Đặt vé máy bay/tàu/xe",
        "*   Đặt phòng khách sạn/homestay",
        "*   Tìm hiểu địa điểm tham quan, ăn uống",
        "*   Chuẩn bị hành lý",
        "*   Di chuyển đến Đà Nẵng",
        "*   Tham quan, vui chơi, ăn uống",
        "*   Di chuyển về"
    ]
}

export default async function generate_subtasks(data: ITodoBehavior) {
  return AIApi.post('/generate_subtasks', data).then(res => res.data as IGeneratedSubTodos);
}
import BackendInstance from "../instances/BackendInstance";
import { storageKey } from "@/store/appStore";

// 🎭 Một template cụ thể
export interface QuestionTemplate {
  template_id: string;      // ID mẫu câu (VD: "T_RATING_01")
  sentence: string;         // Câu hỏi hoàn chỉnh
  slot: string;             // Loại slot ("ocean" hoặc "behavior")
  value_behavior: string[]; // Các giá trị mô tả hành vi
  value_slot: string[];     // Các giá trị mô tả mức độ (VD: "Tốt", "Tệ", "Thỉnh thoảng")
  ocean: string;            // Nhóm tính cách (VD: "R", "F", "Y", "L")
}

// 🔢 Nhóm các câu hỏi theo loại trong từng OCEAN key
export interface OceanGroup {
  rating?: QuestionTemplate[];
  frequency?: QuestionTemplate[];
  yesno?: QuestionTemplate[];
  likert5?: QuestionTemplate[];
}

// 🌊 Toàn bộ cấu trúc chính
export interface OceanTemplateData {
  R?: OceanGroup;
  F?: OceanGroup;
  Y?: OceanGroup;
  L?: OceanGroup;
}

function getToken() {
  return localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)!).access_token : null;
}

function authHeader(): Record<string, string> {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getQuestionTemplates() {
  const res = await BackendInstance.get("/questions/survey", { headers: authHeader() });
  return res.data.data;
}

export default {
  getQuestionTemplates,
};
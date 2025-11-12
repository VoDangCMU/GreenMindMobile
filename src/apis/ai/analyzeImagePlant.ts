import type { Photo } from "@capacitor/camera";
import fileUtils from "@/helpers/fileUtils";
import AIApi from "@/apis/instances/AIInstance";

export interface AnalyzeImagePlantResult {
  vegetable_area: number;
  dish_area: number;
  vegetable_ratio_percent: number;
  plant_image_base64: string;
}

export default async function analyzeImagePlant(photo: Photo): Promise<AnalyzeImagePlantResult> {
  let imageFile: File | null = null;
  if (photo.path) {
    imageFile = await fileUtils.imageFileFromPath(photo.path);
  } else if (photo.webPath) {
    imageFile = await fileUtils.imageFileFromWebURL(photo.webPath);
  }
  if (imageFile === null) {
    throw new Error("Failed to create image file from photo.");
  }
  const formData = new FormData();
  formData.append("file", imageFile);
  return AIApi.post("/analyze-image-plant", formData).then(res => res.data as AnalyzeImagePlantResult);
}

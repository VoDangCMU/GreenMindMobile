import type { Photo } from "@capacitor/camera";
import fileUtils from "@/helpers/fileUtils";
import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface AnalyzeImagePlantResult {
    vegetable_area: number;
    dish_area: number;
    vegetable_ratio_percent: number;
    plant_image_base64: string;
}

export default async function healthyFoodRatio(photo: Photo): Promise<AnalyzeImagePlantResult> {
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
    return BackendInstance.post("/metrics/healthy-food-ratio", formData, { headers: authHeader() }).then(res => res.data as AnalyzeImagePlantResult);
}

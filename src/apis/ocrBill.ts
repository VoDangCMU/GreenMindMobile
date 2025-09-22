import axios from "axios";
import servers from "./servers";
import type { Photo } from "@capacitor/camera";
import fileUtils from "../helpers/fileUtils";
import type { IBill } from "@/store/billStore";
import AIApi from "./AIInstance";

export default async function ocrBill(photo: Photo) {

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

  return AIApi.post('/ocr_text', formData).then(res => res.data as IBill);
}
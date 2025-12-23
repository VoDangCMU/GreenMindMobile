import type { Photo } from "@capacitor/camera";
import fileUtils from "@/helpers/fileUtils"
import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export default async function ocrInvoice(photo: Photo) {

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

    return BackendInstance.post('/ocr', formData, {
        headers: authHeader(),
        timeout: 60000
    }).then(res => res.data as IInvoice);
}
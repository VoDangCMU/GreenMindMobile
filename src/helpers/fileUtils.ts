import { Filesystem } from "@capacitor/filesystem";

export async function imageFileFromWebURL(webURL: string): Promise<File | null> {
  const response = await fetch(webURL);
  const blob = await response.blob();

  const file = new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" });

  return file;
}

export async function imageFileFromPath(filePath: string): Promise<File | null> {
  const file = await Filesystem.readFile({ path: filePath });
  const base64Data = typeof file.data === "string" ? file.data : "";
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const fileObject = new File([byteArray], "photo.jpg", { type: "image/jpeg" });

  return fileObject;
}

export default {
  imageFileFromWebURL,
  imageFileFromPath,
};
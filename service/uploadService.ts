// service/uploadService.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadProfileImage = async (uri: string, userId: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `profileImages/${userId}.jpg`);
  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

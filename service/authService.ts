import { storage, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateUser } from "./userService";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};

export { auth };

export const uploadImageAndUpdateProfile = async (uid: string, image: any) => {
  try {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profileImages/${uid}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    await updateUser(uid, { image: downloadURL });
    return downloadURL;
  } catch (err) {
    console.log(err);
    return null;
  }
};

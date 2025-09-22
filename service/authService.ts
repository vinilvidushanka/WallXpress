import { 
  createUserWithEmailAndPassword, 
  deleteUser, 
  signInWithEmailAndPassword, 
  signOut, 
  updateEmail, 
  updatePassword,
  updateProfile,
  User
} from "firebase/auth";
import { auth } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Alert } from "react-native";

// Login function
const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout function
const logOut = () => {
  return signOut(auth);
};

// Register function
export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
    });

    Alert.alert("Register Success", "User registered successfully!", [{ text: "OK" }]);

    return { success: true, user };
  } catch (error: any) {
    console.log("Error registering user:", error);
    Alert.alert("Register Failed", error.message || "Failed to register user.", [{ text: "OK" }]);
    return { success: false, message: error.message || "Failed to register user." };
  }
};

// Update user email
const updateUserEmail = (user: User, newEmail: string) => {
  return updateEmail(user, newEmail);
};

// Update user password
const updateUserPassword = (user: User, newPassword: string) => {
  return updatePassword(user, newPassword);
};

// Update user profile (display name)
const updateUserProfile = (user: User, name?: string) => {
  return updateProfile(user, { displayName: name });
};

// Delete current user
const deleteCurrentUser = (user: User) => {
  return deleteUser(user);
};

// Upload image and update profile
export const uploadImageAndUpdateProfile = async (
  user: User,
  name?: string,
  localUri?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    let photoURL: string | undefined;

    if (localUri) {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);

      const response = await fetch(localUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, { displayName: name, photoURL });

    Alert.alert("Profile Update", "Profile updated successfully!", [{ text: "OK" }]);

    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.log("STORAGE ERROR FULL:", JSON.stringify(error, null, 2));

    Alert.alert(
      "Profile Update Failed",
      error.message || "Failed to update profile.",
      [{ text: "OK" }]
    );

    return { success: false, message: error.message || "Failed to update profile." };
  }
};

export { login, logOut, updateUserEmail, updateUserPassword, updateUserProfile, deleteCurrentUser };

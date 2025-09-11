import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { uploadProfileImage } from '../../service/uploadService';

const ProfileScreen = () => {
  const userId = auth.currentUser?.uid;
  const [name, setName] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?img=12');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setProfileImage(data.profileImage || profileImage);
        }
      };
      fetchData();
    }
  }, [userId]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return Alert.alert("Permission required", "Allow access to photo library");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      let imageUrl = profileImage;
      if (profileImage && !profileImage.startsWith("https://")) {
        imageUrl = await uploadProfileImage(profileImage, userId);
      }

      await setDoc(doc(db, "users", userId), {
        name,
        profileImage: imageUrl,
        email,
      }, { merge: true });

      Alert.alert("Profile Updated");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center p-6 bg-pink-500 rounded-b-3xl">
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} className="w-28 h-28 rounded-full border-4 border-white mb-3" />
          <MaterialIcons name="edit" size={24} color="white" style={{ position: "absolute", bottom: 0, right: 0 }} />
        </TouchableOpacity>

        <TextInput value={name} onChangeText={setName} className="text-2xl font-bold text-white mt-2 text-center" placeholder="Your Name" />
        <Text className="text-white text-base opacity-80">{email}</Text>
      </View>

      <View className="mt-8 mx-6 space-y-4">
        <TouchableOpacity onPress={saveProfile} className="p-4 bg-pink-500 rounded-2xl shadow-md">
          <Text className="text-white text-center text-lg font-semibold">{loading ? "Saving..." : "Save Profile"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

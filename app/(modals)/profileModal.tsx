import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import * as Icons from "phosphor-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfileImage } from "../../service/imageService";
import { UserDataType } from "@/types/task";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "../../service/userService";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    if (!userData.name.trim()) {
      Alert.alert("User", "Please fill in the name field");
      return;
    }

    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      Alert.alert("User", "Profile updated successfully");
      router.back();
    } else {
      Alert.alert("User", "Something went wrong");
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-400 to-red-300">
      <Animatable.View
        animation="slideInUp"
        duration={500}
        easing="ease-out-cubic"
        className="flex-1 bg-white mt-12 rounded-t-3xl p-6 shadow-2xl"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center mb-8 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0 bg-pink-500 rounded-2xl p-2 w-12 items-center shadow-md"
          >
            <FontAwesome name="caret-left" size={28} color="white" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-800">Update Profile</Text>
        </View>

        {/* Profile Image */}
        <View className="relative w-[90px] h-[90px] mx-auto mb-8">
          <Image
            source={getProfileImage(userData.image)}
            className="w-full h-full rounded-full border-2 border-pink-400"
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={onPickImage}
            className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center absolute bottom-0 right-0 shadow-md"
          >
            <Icons.Pencil size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Name Input */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUp" delay={200} className="mb-6">
            <Text className="text-gray-500 mb-2">Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 text-gray-800 rounded-xl p-4 text-base"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </Animatable.View>
        </ScrollView>

        {/* Save Button */}
        <Animatable.View animation="bounceIn" delay={600}>
          <TouchableOpacity
            className={`py-4 rounded-2xl mt-6 shadow-md ${
              loading ? "bg-gray-400" : "bg-gradient-to-r from-pink-500 to-red-500"
            }`}
            activeOpacity={0.8}
            disabled={loading}
            onPress={onSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-center text-white font-semibold text-base">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default ProfileModal;

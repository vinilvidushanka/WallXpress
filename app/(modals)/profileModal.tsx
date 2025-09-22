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
    <View className="flex-1 p-6 bg-gray-900">
      <Animatable.View
        animation="slideInUp"
        duration={500}
        easing="ease-out-cubic"
        className="flex-1 bg-gray-800 mt-12 rounded-t-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center mb-10 relative px-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0 bg-gray-700 rounded-2xl p-2 w-12 items-center shadow-md"
          >
            <FontAwesome name="caret-left" size={28} color="white" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-yellow-300">
            Update Profile
          </Text>
        </View>

        {/* Profile Image */}
        <View className="items-center mb-10">
          <View className="relative w-[120px] h-[120px]">
            <Image
              source={getProfileImage(userData.image)}
              className="w-full h-full rounded-full border-2 border-yellow-300"
              resizeMode="cover"
            />

            <TouchableOpacity
              onPress={onPickImage}
              className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center absolute bottom-0 right-0 shadow-md"
            >
              <Icons.Pencil size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>


        {/* Name Input */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <Animatable.View animation="fadeInUp" delay={200} className="mb-6 px-2">
            <Text className="text-gray-300 mb-2 text-base">Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-700 text-white rounded-xl p-4 text-base"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </Animatable.View>
        </ScrollView>

        {/* Save Button */}
        <Animatable.View animation="bounceIn" delay={600} className="px-2">
          <TouchableOpacity
            className={`py-4 rounded-2xl mt-6 shadow-md ${
              loading ? "bg-gray-600" : "bg-yellow-400"
            }`}
            activeOpacity={0.8}
            disabled={loading}
            onPress={onSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-center text-gray-900 font-semibold text-base">
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

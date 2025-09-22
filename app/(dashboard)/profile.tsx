import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { getProfileImage } from "../../service/imageService";
import { accountOptionType } from "@/types/task";
import * as Icons from "phosphor-react-native";
import * as Animatable from "react-native-animatable";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { useFavorites } from "../../context/FavoritesContext";

const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { favorites } = useFavorites();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={24} color="white" />,
      bgColor: "#6366f1",
      routeName: "/(modals)/profileModal",
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={24} color="white" />,
      bgColor: "#059669",
      routeName: "/(modals)/settingsModal",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={24} color="white" />,
      bgColor: "#525252",
      routeName: "/(modals)/privacyModal",
    },
    {
      title: "Logout",
      icon: <Icons.Power size={24} color="white" />,
      bgColor: "#e11d48",
      routeName: "/login",
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: handleLogout, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      showLogoutAlert();
    } else if (item.routeName) {
      router.push(item.routeName);
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 pt-10 p-6 bg-gray-900">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Animatable.View animation="fadeInDown" duration={600} className="items-center pt-12 px-4">
            

            <View className="mb-6 relative">
              <Image
                source={getProfileImage(user?.image)}
                className="w-28 h-28 rounded-full border-2 border-yellow-400 mx-auto shadow-lg"
                style={{ width: 112, height: 112 }}
              />
            </View>

            <View className="mb-8">
              <Text className="text-yellow-300 text-center text-2xl font-bold">
                {user?.name || "Guest"}
              </Text>
              <Text className="text-gray-300 text-center text-sm mt-1">
                {user?.email || ""}
              </Text>
            </View>

            {/* Account Options */}
            <View className="w-full px-2 p-4">
              {accountOptions.map((item, index) => (
                <Animatable.View
                  key={index.toString()}
                  animation="slideInRight"
                  delay={index * 150}
                  className="mb-4"
                >
                  <TouchableOpacity
                    onPress={() => handlePress(item)}
                    className="flex-row items-center p-3 rounded-xl bg-gray-800 shadow-md"
                  >
                    <View
                      className="w-12 h-12 rounded-lg items-center justify-center shadow-md"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      {item.icon}
                    </View>

                    <Text className="flex-1 text-white font-semibold text-base ml-4">
                      {item.title}
                    </Text>

                    <Icons.CaretRight size={24} color="white" weight="bold" />
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>

            {/* Favorites Section */}
            <View className="w-full p-5 mt-8 px-2">
              <Text className="text-yellow-300 font-bold text-xl mb-4">Favorites</Text>
              {favorites.length === 0 ? (
                <Text className="text-gray-400">No favorite wallpapers yet.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                  {favorites.map((image, index) => (
                    <Animatable.View
                      key={index}
                      animation="fadeInUp"
                      delay={index * 100}
                      className="mr-4  w-32 h-48 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
                    >
                      <Image
                        source={image}
                        style={{ width: 128, height: 192 }}
                        className="rounded-2xl "
                        resizeMode="cover"
                      />
                    </Animatable.View>
                  ))}
                </ScrollView>
              )}
            </View>
          </Animatable.View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

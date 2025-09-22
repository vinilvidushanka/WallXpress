import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Asset } from "expo-asset";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useFavorites } from "../../context/FavoritesContext";

const categories = [
  { title: "Trending", image: require("../../assets/wallpaper/bat man.jpg") },
  { title: "Aesthetic", image: require("../../assets/wallpaper/aesthetic1.jpg") },
  { title: "Space", image: require("../../assets/wallpaper/space.jpg") },
  { title: "Technology", image: require("../../assets/wallpaper/techno.jpg") },
];

const trendingWallpapers = [
  require("../../assets/wallpaper/bat man.jpg"),
  require("../../assets/wallpaper/nature.jpg"),
  require("../../assets/wallpaper/space.jpg"),
  require("../../assets/wallpaper/techno.jpg"),
  require("../../assets/wallpaper/hd mobile.jpg"),
  require("../../assets/wallpaper/rainbow-end-road-landscape_23-2151596743.jpg"),
];

const aestheticWallpapers = [
  require("../../assets/wallpaper/aesthetic1.jpg"),
  require("../../assets/wallpaper/aesthetic2.jpg"),
  require("../../assets/wallpaper/aesthetic3.jpg"),
  require("../../assets/wallpaper/aesthetic4.jpg"),
];

const spaceWallpapers = [
  require("../../assets/wallpaper/space (1).jpg"),
  require("../../assets/wallpaper/space (2).jpg"),
  require("../../assets/wallpaper/space (3).jpg"),
  require("../../assets/wallpaper/space (4).jpg"),
  require("../../assets/wallpaper/space (5).jpg"),
];


const CARD_WIDTH = 160;
const CARD_HEIGHT = 240;

const Home = () => {
  const { favorites, toggleFavorite } = useFavorites(); // Use global favorites

  // const downloadWallpaper = async (image: any) => {
  //   try {
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission required", "Allow media access to download wallpapers.");
  //       return;
  //     }

  //     const localUri = FileSystem.cacheDirectory + `wallpaper_${Date.now()}.jpg`;
  //     // @ts-ignore
  //     await FileSystem.copyAsync({ from: image, to: localUri });
  //     await MediaLibrary.saveToLibraryAsync(localUri);

  //     Alert.alert("Success", "Wallpaper saved to your gallery!");
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert("Error", "Failed to download wallpaper.");
  //   }
  // };

  const downloadWallpaper = async (image: any) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Allow media access to download wallpapers.");
      return;
    }

    // Convert require() image to Asset
    const asset = Asset.fromModule(image);
    await asset.downloadAsync(); // downloads to cache

    const localUri = asset.localUri || asset.uri;

    // Directly save to gallery
    await MediaLibrary.saveToLibraryAsync(localUri!);

    Alert.alert("✅ Success", "Wallpaper saved to your gallery!");
  } catch (error) {
    console.log("Download error:", error);
    Alert.alert("❌ Error", "Failed to download wallpaper.");
  }
};



  return (
    <ScrollView className="flex-1 p-5 bg-gray-900" contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header */}
      <Animatable.View animation="fadeInDown" duration={600} className="px-6 pt-16 pb-6">
        <Text style={{ fontSize: 36, fontWeight: "800", marginBottom: 8, color: "#fef3c7" }}>
          WallXpress
        </Text>
        <Text className="text-gray-300 text-lg mb-6">
          Download and explore stunning wallpapers
        </Text>

        <View className="bg-gray-700 rounded-full flex-row items-center px-5 py-3 shadow-md">
          <TextInput
            placeholder="Search wallpapers..."
            placeholderTextColor="#D1D5DB"
            className="flex-1 text-base text-white"
          />
        </View>
      </Animatable.View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        {categories.map((item, index) => (
          <Animatable.View
            key={index}
            animation="fadeInRight"
            delay={index * 150}
            style={{ marginRight: 16 }}
          >
            <TouchableOpacity
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-700 transform active:scale-95"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <Image
                source={item.image}
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                className="rounded-3xl"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 flex justify-end p-4 rounded-3xl">
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fef3c7" }}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Trending Wallpapers */}
      <Animatable.View animation="fadeInUp" delay={300} className="mt-8 px-6 pb-8">
        <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12, color: "#fef3c7" }}>
          Trending Wallpapers
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trendingWallpapers.map((image, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative transform active:scale-95"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: 20 }}
            >
              <Image
                source={image}
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                className="rounded-3xl"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 rounded-3xl" />

              <TouchableOpacity
                onPress={() => toggleFavorite(image)}
                className="absolute bottom-4 left-4 p-3 bg-white/20 rounded-full shadow-md"
              >
                <FontAwesome
                  name={favorites.includes(image) ? "heart" : "heart-o"}
                  size={22}
                  color={favorites.includes(image) ? "#f43f5e" : "#fcd34d"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => downloadWallpaper(image)}
                className="absolute bottom-4 right-4 p-3 bg-white/20 rounded-full shadow-md"
              >
                <FontAwesome name="download" size={22} color="#06b6d4" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animatable.View>

      {/* Aesthetic Wallpapers */}
      <Animatable.View animation="fadeInUp" delay={400} className="mt-4 px-6 pb-8">
        <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12, color: "#fef3c7" }}>
          Aesthetic Wallpapers
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {aestheticWallpapers.map((image, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative transform active:scale-95"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: 20 }}
            >
              <Image
                source={image}
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                className="rounded-3xl"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 rounded-3xl" />

              <TouchableOpacity
                onPress={() => toggleFavorite(image)}
                className="absolute bottom-4 left-4 p-3 bg-white/20 rounded-full shadow-md"
              >
                <FontAwesome
                  name={favorites.includes(image) ? "heart" : "heart-o"}
                  size={22}
                  color={favorites.includes(image) ? "#f43f5e" : "#fcd34d"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => downloadWallpaper(image)}
                className="absolute bottom-4 right-4 p-3 bg-white/20 rounded-full shadow-md"
              >
                <FontAwesome name="download" size={22} color="#06b6d4" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animatable.View>

          {/* Space Wallpapers */}
<Animatable.View animation="fadeInUp" delay={500} className="mt-4 px-6 pb-8">
  <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12, color: "#fef3c7" }}>
    Space Wallpapers
  </Text>

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {spaceWallpapers.map((image, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.9}
        className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative transform active:scale-95"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: 20 }}
      >
        <Image
          source={image}
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          className="rounded-3xl"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 rounded-3xl" />

        <TouchableOpacity
          onPress={() => toggleFavorite(image)}
          className="absolute bottom-4 left-4 p-3 bg-white/20 rounded-full shadow-md"
        >
          <FontAwesome
            name={favorites.includes(image) ? "heart" : "heart-o"}
            size={22}
            color={favorites.includes(image) ? "#f43f5e" : "#fcd34d"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => downloadWallpaper(image)}
          className="absolute bottom-4 right-4 p-3 bg-white/20 rounded-full shadow-md"
        >
          <FontAwesome name="download" size={22} color="#06b6d4" />
        </TouchableOpacity>
      </TouchableOpacity>
    ))}
  </ScrollView>
</Animatable.View>


    </ScrollView>
  );
};

export default Home;

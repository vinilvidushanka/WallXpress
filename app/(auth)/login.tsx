import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { login } from "../../service/authService";

const WallXpressLoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(email, password);
      console.log("User Data:", userCredential.user);
      router.replace("/home");
    } catch (err: any) {
      console.log(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-600 via-red-500 to-red-700 items-center justify-center px-6">
      {/* Logo & Title */}
      <View className="items-center mb-10">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
          }}
          className="w-28 h-28 rounded-full mb-4 shadow-2xl"
        />
        <Text className="text-5xl font-extrabold text-pink-600">WallXpress</Text>
        <Text className="text-base text-black/70 mt-1 text-center px-6">
          Explore and download stunning wallpapers instantly
        </Text>
      </View>

      {/* Login Card */}
      <View className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Email Input */}
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 mb-4 border border-gray-200 shadow-sm">
          <MaterialIcons name="email" size={22} color="#9CA3AF" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="ml-4 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Password Input */}
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 mb-6 border border-gray-200 shadow-sm">
          <Feather name="lock" size={22} color="#9CA3AF" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="ml-4 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="py-4 rounded-2xl items-center shadow-lg active:scale-95"
          style={{
            backgroundColor: "#f43f5e",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Login</Text>
          )}
        </Pressable>

        {/* Or Divider */}
        <View className="flex-row items-center justify-center my-5">
          <View className="h-px flex-1 bg-gray-200" />
          <Text className="text-sm text-gray-400 mx-3">or</Text>
          <View className="h-px flex-1 bg-gray-200" />
        </View>

        {/* Guest Login */}
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="py-3 rounded-2xl border border-gray-300 items-center mb-4 bg-gray-50 shadow-sm"
        >
          <Text className="text-gray-700 font-medium">Continue as Guest</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text className="text-pink-600 font-semibold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text className="text-xs text-black/70 mt-6 text-center px-4">
        By continuing, you agree to our Terms & Privacy.
      </Text>
    </View>
  );
};

export default WallXpressLoginScreen;

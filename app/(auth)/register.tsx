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
import { register } from "../../service/authService";

const WallXpressRegisterScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please enter all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      alert("Account created successfully!");
      router.replace("/home");
    } catch (err: any) {
      alert(err.message || "Registration failed");
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
        <Text className="text-base text-black mt-1 text-center px-6">
          Join us today! Fill in your details to get started.
        </Text>
      </View>

      {/* Register Card */}
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
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 mb-4 border border-gray-200 shadow-sm">
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

        {/* Confirm Password Input */}
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-5 py-3 mb-6 border border-gray-200 shadow-sm">
          <Feather name="lock" size={22} color="#9CA3AF" />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            className="ml-4 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialIcons
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="py-4 rounded-2xl items-center shadow-lg active:scale-95"
          style={{
            backgroundColor: "#f43f5e",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-bold">Register</Text>
          )}
        </Pressable>

        {/* Go to Login */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-sm text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-pink-600 font-semibold">Login</Text>
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

export default WallXpressRegisterScreen;

// app/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { register } from '../../service/authService';

const WallXpressRegisterScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <View className="flex-1 bg-gradient-to-b from-pink-400 to-red-300 items-center justify-center px-6">
      {/* App Logo & Name */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder' }}
          className="w-24 h-24 rounded-full mb-3 shadow-lg"
        />
        <Text className="text-4xl font-extrabold text-white">WallXpress</Text>
        <Text className="text-sm text-white/80 mt-1 text-center px-6">
          Join us today! Fill in your details to get started.
        </Text>
      </View>

      {/* Register Card */}
      <View className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
        {/* Email Input */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <MaterialIcons name="email" size={20} color="#9CA3AF" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="ml-3 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Password Input */}
        <View className="relative w-full mb-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="w-full bg-gray-100 rounded-xl p-4 text-gray-800"
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View className="relative w-full mb-6">
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            className="w-full bg-gray-100 rounded-xl p-4 text-gray-800"
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <MaterialIcons
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <Pressable
          onPress={handleRegister}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-red-500 py-4 rounded-full items-center shadow-md active:scale-95"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Register</Text>
          )}
        </Pressable>

        {/* Go to Login */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-sm text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text className="text-pink-500 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text className="text-xs text-white/70 mt-4 text-center px-4">
        By continuing, you agree to our Terms & Privacy.
      </Text>
    </View>
  );
};

export default WallXpressRegisterScreen;

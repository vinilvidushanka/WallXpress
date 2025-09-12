import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (user) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      }, 0);
    }
  }, [user, loading]);

  return loading ? (
    <View className="flex-1 w-full justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  ) : null;
};

export default Index;

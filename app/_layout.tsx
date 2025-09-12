import { Slot } from "expo-router";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { FavoritesProvider } from "@/context/FavoritesContext"; // import FavoritesProvider
import "./../global.css";

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <FavoritesProvider>  {/* Wrap your app with FavoritesProvider */}
          <Slot />
        </FavoritesProvider>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default RootLayout;

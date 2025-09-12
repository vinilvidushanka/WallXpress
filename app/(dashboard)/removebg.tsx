import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const RemoveBG = () => {
  const [image, setImage] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const apiKey = "CnbjLASYDARPreTpJgDuRdo1"; // your remove.bg API key

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  // Remove background
  const removeBackground = async () => {
    if (!image) {
      Alert.alert('No image selected', 'Please select an image first');
      return;
    }

    try {
      setLoading(true);

      // Convert local URI to blob
      const imgBase64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      const blob = await (await fetch(`data:image/jpeg;base64,${imgBase64}`)).blob();

      const formData = new FormData();
      formData.append('image_file', blob);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to remove background');
      }

      const resultBlob = await response.blob();
      const resultUri = URL.createObjectURL(resultBlob); // for web preview
      setResult(resultUri);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  // Download processed image to gallery
  const downloadImage = async () => {
    if (!result) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Allow media access to save image.');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `bg_removed_${Date.now()}.png`;
      await FileSystem.copyAsync({ from: result, to: fileUri });
      await MediaLibrary.saveToLibraryAsync(fileUri);

      Alert.alert('Saved', 'Image saved to your gallery!');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  return (
    <View className="flex-1 bg-gray-900 items-center justify-start p-5">
      <Text className="text-white text-2xl font-bold mb-4">Remove Background</Text>

      <TouchableOpacity onPress={pickImage} className="bg-blue-600 px-6 py-3 rounded-full mb-4">
        <Text className="text-white text-lg">Pick Image</Text>
      </TouchableOpacity>

      {image && !result && (
        <Image
          source={{ uri: image }}
          style={{ width: 250, height: 250, borderRadius: 12 }}
          resizeMode="contain"
        />
      )}

      {image && !result && (
        <TouchableOpacity
          onPress={removeBackground}
          className="bg-green-600 px-6 py-3 rounded-full mt-4 flex-row items-center"
        >
          {loading && <ActivityIndicator color="#fff" className="mr-2" />}
          <Text className="text-white text-lg">Remove Background</Text>
        </TouchableOpacity>
      )}

      {result && (
        <View className="mt-6 items-center">
          <Text className="text-white text-lg mb-2">Result:</Text>
          <Image
            source={{ uri: result }}
            style={{ width: 250, height: 250, borderRadius: 12 }}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={downloadImage}
            className="bg-purple-600 px-6 py-3 rounded-full mt-4"
          >
            <Text className="text-white text-lg">Download</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RemoveBG;

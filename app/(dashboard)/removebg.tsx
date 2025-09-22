import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { FontAwesome } from '@expo/vector-icons';

const CARD_WIDTH = 330; // adjust to screen width
const CARD_HEIGHT = 220;

const RemoveBG = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiKey = "CnbjLASYDARPreTpJgDuRdo1"; 

  // Pick image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Allow gallery access.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setResult(null);
    }
  };

  // Remove background using remove.bg
  const removeBackground = async () => {
    if (!image) {
      Alert.alert('No image', 'Select an image first.');
      return;
    }

    try {
      setLoading(true);

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

      // Convert blob to base64 URI for React Native Image component
      const reader = new FileReader();
      reader.onload = () => {
        const uri = reader.result as string;
        setResult(uri);
      };
      reader.readAsDataURL(resultBlob);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  // Download result image
  const downloadImage = async () => {
    if (!result) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Allow media access to save image.');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `bg_removed_${Date.now()}.png`;
      // Convert base64 URI to file
      const base64Data = result.split(',')[1];
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
      await MediaLibrary.saveToLibraryAsync(fileUri);

      Alert.alert('Saved', 'Image saved to your gallery!');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-6">
      <Text className="text-4xl font-extrabold text-yellow-200 mb-6">Remove Background</Text>

      {/* Original Image */}
      {image ? (
        <View
          className="rounded-2xl overflow-hidden shadow-2xl mb-5 border border-gray-700"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <Image
            source={{ uri: image }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            className="rounded-2xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => setImage(null)}
            className="absolute top-3 right-3 p-2 bg-white/30 rounded-full"
          >
            <FontAwesome name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          className="bg-blue-600 px-6 py-4 rounded-xl shadow-lg mb-5 items-center"
        >
          <Text className="text-white text-lg font-semibold">Pick Image</Text>
        </TouchableOpacity>
      )}

      {/* Remove BG Button */}
      {image && !result && (
        <TouchableOpacity
          onPress={removeBackground}
          className="bg-green-600 px-6 py-4 rounded-xl shadow-lg mb-6 flex-row justify-center items-center"
        >
          {loading && <ActivityIndicator color="#fff" className="mr-2" />}
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Processing...' : 'Remove Background'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Result Image */}
      {result && (
        <View
          className="rounded-2xl overflow-hidden shadow-2xl mb-5 border border-gray-700"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          <Image
            source={{ uri: result }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            className="rounded-2xl"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Download Button */}
      {result && (
        <TouchableOpacity
          onPress={downloadImage}
          className="bg-purple-600 px-6 py-4 rounded-xl shadow-lg items-center mb-10"
        >
          <Text className="text-white text-lg font-semibold">Download Image</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default RemoveBG;

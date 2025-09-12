import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { uploadProfileImageNoCORS } from '../../service/uploadService';
import { uploadProfileImage } from '@/service/uploadService';

type Props = {
  userId: string;
  name: string;
  profileImage: string;
  closeModal: () => void;
  onProfileUpdate: (name: string, profileImage: string) => void;
};

const ProfileModal: React.FC<Props> = ({ 
  userId, 
  name: initialName, 
  profileImage: initialImage, 
  closeModal,
  onProfileUpdate 
}) => {
  const [name, setName] = useState(initialName);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const displayImage = selectedImage || initialImage;

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return Alert.alert(
          "Permission Required", 
          "Please allow access to photos to update your profile picture"
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      return Alert.alert("Error", "Please enter your name");
    }

    if (name.trim().length < 2) {
      return Alert.alert("Error", "Name must be at least 2 characters long");
    }

    setLoading(true);
    setUploadProgress(0);
    
    try {
      let finalImageUrl = initialImage;

      // Upload new image if selected
      if (selectedImage) {
        try {
          setUploadProgress(25);
          console.log('Starting image upload...');
          
          // Try the CORS-free method first
          try {
            finalImageUrl = await uploadProfileImageNoCORS(selectedImage, userId);
          } catch (corsError) {
            console.log('CORS-free method failed, trying fallback...');
            // Fallback to original method
            finalImageUrl = await uploadProfileImage(selectedImage, userId);
          }
          
          setUploadProgress(75);
          console.log('Image upload successful:', finalImageUrl);
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          Alert.alert(
            "Upload Failed", 
            `Failed to upload image: ${uploadError.message}\n\nYou can still save your name changes.`,
            [
              { text: "Save Name Only", onPress: () => proceedWithSave(initialImage) },
              { text: "Cancel", style: "cancel" }
            ]
          );
          return;
        }
      }

      await proceedWithSave(finalImageUrl);

    } catch (error: any) {
      console.error('Profile save error:', error);
      Alert.alert(
        "Error", 
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const proceedWithSave = async (imageUrl: string) => {
    try {
      setUploadProgress(90);

      // Update user document in Firestore
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { 
        name: name.trim(),
        profileImage: imageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setUploadProgress(100);

      // Call callback to update parent component
      onProfileUpdate(name.trim(), imageUrl);
      
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: closeModal }
      ]);

    } catch (error: any) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  };

  const getUploadStatusText = () => {
    if (uploadProgress < 25) return 'Preparing image...';
    if (uploadProgress < 75) return 'Uploading image...';
    if (uploadProgress < 90) return 'Processing...';
    if (uploadProgress < 100) return 'Saving profile...';
    return 'Complete!';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
        <TouchableOpacity onPress={closeModal} className="p-2">
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Edit Profile</Text>
        <View className="w-8" />
      </View>

      <View className="flex-1 p-6">
        {/* Profile Image Section */}
        <View className="items-center mb-8">
          <TouchableOpacity 
            onPress={pickImage}
            className="relative"
            disabled={loading}
          >
            <Image 
              source={{ uri: displayImage }} 
              className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600"
              defaultSource={{ uri: 'https://via.placeholder.com/128/374151/9CA3AF?text=User' }}
            />
            
            {/* Edit Icon Overlay */}
            <View className="absolute bottom-2 right-2 bg-green-500 p-2 rounded-full">
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
            
            {/* Upload Progress Overlay */}
            {loading && uploadProgress > 0 && (
              <View className="absolute inset-0 bg-black bg-opacity-70 rounded-full items-center justify-center">
                <ActivityIndicator color="#10b981" size="large" />
                <Text className="text-white text-xs mt-2 text-center px-2">
                  {getUploadStatusText()}
                </Text>
                <View className="w-20 h-2 bg-gray-700 rounded-full mt-2">
                  <View 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Tap to change profile picture
          </Text>
        </View>

        {/* Name Input Section */}
        <View className="mb-6">
          <Text className="text-white text-base font-medium mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            className="bg-gray-800 p-4 rounded-xl text-white text-base border border-gray-700 focus:border-green-500"
            editable={!loading}
            maxLength={50}
          />
          <Text className="text-gray-500 text-xs mt-1">
            {name.length}/50 characters
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`p-4 rounded-xl mt-4 ${loading ? 'bg-gray-600' : 'bg-green-500'}`}
          onPress={saveProfile}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white text-center font-semibold text-base ml-2">
                {getUploadStatusText()}
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="p-4 rounded-xl mt-3 border border-gray-600"
          onPress={closeModal}
          disabled={loading}
        >
          <Text className="text-gray-300 text-center font-medium text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileModal;
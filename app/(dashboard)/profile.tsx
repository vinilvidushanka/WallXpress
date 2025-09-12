import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import ProfileModal from '../../app/(modals)/profileModal';

const ProfileScreen = () => {
  const userId = auth.currentUser?.uid;
  const [name, setName] = useState('User');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/128/374151/9CA3AF?text=User');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || 'User');
        setProfileImage(data.profileImage || 'https://via.placeholder.com/128/374151/9CA3AF?text=User');
      } else {
        // If document doesn't exist, create one with default values
        await createUserDocument();
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Create user document if it doesn't exist
  const createUserDocument = async () => {
    if (!userId) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        name: auth.currentUser?.displayName || 'User',
        email: auth.currentUser?.email || '',
        profileImage: 'https://via.placeholder.com/128/374151/9CA3AF?text=User',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  };

  // Real-time listener for profile updates
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setName(data.name || 'User');
          setProfileImage(data.profileImage || 'https://via.placeholder.com/128/374151/9CA3AF?text=User');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error in profile listener:', error);
        fetchUserData(); // Fallback to one-time fetch
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Handle profile update from modal
  const handleProfileUpdate = (newName: string, newProfileImage: string) => {
    setName(newName);
    setProfileImage(newProfileImage);
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error: any) {
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-600 mt-2">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!userId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-6">
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-800 mt-4 text-center">
          Authentication Error
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Please login again to access your profile
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#ec4899" />
      
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="items-center p-6 bg-pink-500 rounded-b-3xl">
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="relative"
          >
            <Image 
              source={{ uri: profileImage }} 
              className="w-28 h-28 rounded-full border-4 border-white"
              defaultSource={{ uri: 'https://via.placeholder.com/128/374151/9CA3AF?text=User' }}
            />
            <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <MaterialIcons name="edit" size={20} color="#ec4899" />
            </View>
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-white mt-4 text-center">
            {name}
          </Text>
          <Text className="text-white text-base opacity-90 mt-1">
            {email}
          </Text>
        </View>

        {/* Profile Options */}
        <View className="p-6">
          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-3"
              onPress={() => setModalVisible(true)}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="person" size={24} color="#374151" />
                <Text className="text-gray-800 font-medium ml-3 text-base">
                  Edit Profile
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-3"
              onPress={() => Alert.alert('Coming Soon', 'Settings feature will be available soon!')}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="settings" size={24} color="#374151" />
                <Text className="text-gray-800 font-medium ml-3 text-base">
                  Settings
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 bg-white rounded-xl shadow-sm"
              onPress={handleLogout}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="logout" size={24} color="#ef4444" />
                <Text className="text-red-500 font-medium ml-3 text-base">
                  Logout
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="items-center mt-8">
            <Text className="text-gray-500 text-sm">
              WallXpress v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal 
        visible={modalVisible} 
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ProfileModal
          userId={userId}
          name={name}
          profileImage={profileImage}
          closeModal={() => setModalVisible(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
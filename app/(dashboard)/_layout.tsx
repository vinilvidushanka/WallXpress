import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Slot, Tabs, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const DashBoardLayout = () => {
  const{user,loading} = useAuth()
  const router = useRouter()
  console.log("User Data : ",user);
  
  
  useEffect(()=>{
    if(!loading && !user){
      router.push('/login')
    }
  },[user,loading])

  return <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "blue",
    tabBarInactiveTintColor: "gray",
  }}
  >
    <Tabs.Screen name="home" 
    options={{ 
        title: "Home" ,
        tabBarIcon:(data)=>(
            <MaterialIcons 
            name="home" 
            size={data.size} 
            color={data.color} />
        )
    }} 
    />
    <Tabs.Screen name="profile" 
    options={{
         title: "Profile" ,
         tabBarIcon:(data)=>(
            <MaterialIcons 
            name="person" 
            size={data.size} 
            color={data.color} />
        )
         }} />
    <Tabs.Screen
      name="Remove BG"
      options={{
        title: "Remove BG",
        tabBarIcon: (data) => (
          <MaterialIcons
            name="photo-library"  
            size={data.size}
            color={data.color}
          />
        ),
      }}
    />

    <Tabs.Screen
      name="uploads"   
      options={{
        title: "Uploads",
        tabBarIcon: (data) => (
          <MaterialIcons name="check-circle" size={data.size} color={data.color} />
        ),
      }}
    />

  </Tabs>
}

export default DashBoardLayout
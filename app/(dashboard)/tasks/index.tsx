import { View, Text, Pressable, ScrollView, TouchableOpacity, Alert } from 'react-native';
import 'nativewind';
import React, { useEffect, useState } from 'react';
import { getAllTaskData, taskColRef } from '@/service/config/taskService';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Task } from '@/types/task';
import { onSnapshot } from 'firebase/firestore';

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  const handleFetchData = async () => {
    try {
      const data = await getAllTaskData();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   handleFetchData();
  // }, []);

  useEffect(()=>{
    onSnapshot(taskColRef,
      (snapshot)=>{
        const taskList = snapshot.docs.map((taskRef) => ({
        id: taskRef.id,
        ...taskRef.data(),
      })) as Task[];
      setTasks(taskList)
      },
      (err)=>{
        console.error(err)
      })
  })

  const handleDelete = () =>{
    Alert.alert("Alert Title","Alert Desc",[
      {text:"Cansel"},
      {
        text:"Delete",
        onPress:async()=>{}
      }
    ])
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="py-8 px-4 bg-white shadow-md">
        <Text className="text-3xl font-bold text-center text-gray-800">Tasks</Text>
      </View>

      {/* Task List */}
      <ScrollView className="px-4 mt-4">
        {tasks.map((task) => (
          <View
            key={task.id}
            className="bg-white rounded-2xl p-4 mb-4 shadow-lg border border-gray-200"
          >
            <Text className="text-xl font-semibold text-gray-900 mb-1">{task.title}</Text>
            <Text className="text-gray-600 mb-3">{task.description}</Text>

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="bg-yellow-400 p-2 rounded-lg"
                onPress={() => router.push(`/(dashboard)/tasks/${task.id}`)}
              >
                <Entypo name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 p-2 rounded-lg"
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <View className="absolute bottom-6 right-6">
        <Pressable
          onPress={() => router.push("/(dashboard)/tasks/new")}
          className="bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-2xl"
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

export default TaskScreen;

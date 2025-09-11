// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { router, useLocalSearchParams, useRouter } from 'expo-router'
// import { createTask, getTaskById, updateTask } from '@/service/config/taskService'

// const TaskFormScreen = () => {

//     const {id} = useLocalSearchParams<{id ?: string}>()
//     const isNew = !id || id === "new"

//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState<string>('');

//     const router = useRouter()

//     useEffect(() => {
//         const load = async () => {
//             if (!isNew && id) {
//             try {
//                 const task = await getTaskById(id);
//                 if (task) {
//                 setTitle(task.title);
//                 setDescription(task.description);
//                 }
//             } catch (error) {
//                 console.log("Error loading task:", error);
//             }
//             }
//         };

//         load();
//         }, [id, isNew]);

//     const handleSubmit = async()=>{
//         if(!title.trim){
//             Alert.alert("Validation","Title is required")
//             return
//         }

//         try{
//             showLoader()
//             if(isNew){
//                 await createTask({title,description})
//             }else{
//                 await updateTask({title,description})
//             }
//             router.back()
//         }catch(err){
//             console.error("Error saving task:",err)
//             Alert.alert("Error","Dailed to save task")
//         }
//     }

//   return (
//     <View className="flex-1 p-5 bg-white">
//       <Text className="text-2xl font-bold mb-5">{isNew ? "Add Task" : "Edit Task"}</Text>

//       <TextInput
//         className="border border-gray-300 rounded-lg p-3 mb-4"
//         placeholder="Title"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <TextInput
//         className="border border-gray-300 rounded-lg p-3 mb-4 h-24 text-top"
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       <TouchableOpacity
//         className="bg-blue-500 rounded-lg p-4 items-center"
//         onPress={handleSubmit}
//       >
//         <Text className="text-white font-bold">{isNew ? "Add Task" : "Update Task"}</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default TaskFormScreen

// function showLoader() {
//     throw new Error('Function not implemented.')
// }


import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createTask, getTaskById, updateTask } from "@/service/config/taskService";
import { useLoader } from "@/context/LoaderContext"; // ✅ loader context

const TaskFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");

  const router = useRouter();
  const { showLoader, hideLoader } = useLoader(); // ✅ use loader context

  useEffect(() => {
    const load = async () => {
      if (!isNew && id) {
        try {
          const task = await getTaskById(id);
          if (task) {
            setTitle(task.title);
            setDescription(task.description);
          }
        } catch (error) {
          console.log("Error loading task:", error);
        }
      }
    };

    load();
  }, [id, isNew]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }

    try {
      showLoader();

      if (isNew) {
        await createTask({ title, description });
      } else if (id) {
        await updateTask(id, { title, description });
      }

      hideLoader();
      router.back();
    } catch (err) {
      hideLoader();
      console.error("Error saving task:", err);
      Alert.alert("Error", "Failed to save task");
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">
        {isNew ? "Add Task" : "Edit Task"}
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 h-24 text-top"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold">
          {isNew ? "Add Task" : "Update Task"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskFormScreen;

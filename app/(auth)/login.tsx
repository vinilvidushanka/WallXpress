// import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
// import React, { useState } from 'react';
// import { useRouter } from 'expo-router';
// import { login } from '../../service/authService';
// import { MaterialIcons } from '@expo/vector-icons';

// const Login = () => {
//   const router = useRouter();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleRegister = () => {
//     if (!email || !password) {
//       alert('Please enter all fields');
//       return;
//     }

//     setLoading(true);

//     login(email, password)
//       .then(() => {
//         alert('Account created successfully!');
//         router.push('/home');
//       })
//       .catch((error: any) => {
//         alert(error.message || 'Registration failed');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <View className="flex-1 items-center justify-center p-6">
//       <View className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl items-center">
//         <Text className="text-4xl font-bold text-gray-800 mb-4">
//           Create Account
//         </Text>
//         <Text className="text-base text-gray-500 mb-6 text-center">
//           Join us today! Fill in your details to get started.
//         </Text>

//         {/* Email Input */}
//         <TextInput
//           value={email}
//           onChangeText={setEmail}
//           placeholder="Email"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           className="w-full bg-gray-100 rounded-xl p-4 mb-4 text-gray-800"
//         />

//         {/* Password Input */}
//         <View className="relative w-full mb-4">
//           <TextInput
//             value={password}
//             onChangeText={setPassword}
//             placeholder="Password"
//             secureTextEntry={!showPassword}
//             className="w-full bg-gray-100 rounded-xl p-4 text-gray-800"
//           />
//           <TouchableOpacity
//             className="absolute right-4 top-4"
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <MaterialIcons
//               name={showPassword ? 'visibility' : 'visibility-off'}
//               size={24}
//               color="gray"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Register Button */}
//         <Pressable
//           onPress={handleRegister}
//           className="bg-red-500 w-full py-4 rounded-full shadow-lg active:scale-95 transition-all duration-150"
//           disabled={loading}
//         >
//           <Text className="text-white text-lg font-semibold tracking-wide text-center">
//             {loading ? 'Loading...' : 'Login'}
//           </Text>
//         </Pressable>

//         {/* Go to Login */}
//         <Pressable onPress={() => router.push('/register')} className="mt-4">
//           <Text className="text-red-500 font-semibold">
//             Don't have an account? Register
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default Login;


// app/login.tsx
// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { login } from '../../service/authService';

const WallXpressLoginScreen: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(email, password);
      console.log('User Data:', userCredential.user);
      router.replace('/home');
    } catch (err: any) {
      console.log(err);
      alert(err.message || 'Login failed');
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
          Download beautiful wallpapers instantly
        </Text>
      </View>

      {/* Login Card */}
      <View className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
        {/* Email */}
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

        {/* Password */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Feather name="lock" size={20} color="#9CA3AF" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="ml-3 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-red-500 py-3 rounded-full items-center shadow-md active:scale-95"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Login</Text>
          )}
        </Pressable>

        {/* Or divider */}
        <View className="flex-row items-center justify-center space-x-3 my-4">
          <View className="h-px flex-1 bg-gray-200" />
          <Text className="text-sm text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-200" />
        </View>

        {/* Guest Login */}
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          className="py-3 rounded-full border border-gray-300 items-center mb-4"
        >
          <Text className="text-gray-700 font-medium">Continue as Guest</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="flex-row justify-center mt-2">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-pink-500 font-semibold">Register</Text>
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

export default WallXpressLoginScreen;

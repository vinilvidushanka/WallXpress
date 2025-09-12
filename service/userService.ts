// uploadService.ts - CORS issue නැති upload service
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';

// Convert image URI to Blob (React Native web compatible)
const uriToBlob = async (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new Error('Failed to convert image'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

// Alternative: Use Canvas to convert image
const imageToBlob = async (imageUri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        }, 'image/jpeg', 0.8);
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUri;
  });
};

// CORS-free upload function
export const uploadProfileImageNoCORS = async (imageUri: string, userId: string): Promise<string> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    console.log('Starting upload process...');
    
    // Method 1: Try direct blob conversion
    let blob: Blob;
    try {
      if (imageUri.startsWith('data:')) {
        // Handle data URLs
        const response = await fetch(imageUri);
        blob = await response.blob();
      } else {
        // Use canvas method for regular URIs
        blob = await imageToBlob(imageUri);
      }
    } catch (error) {
      console.log('Blob conversion method 1 failed, trying method 2...');
      // Fallback method
      blob = await uriToBlob(imageUri);
    }

    console.log('Blob created successfully, size:', blob.size);

    const storage = getStorage();
    const timestamp = Date.now();
    const imageRef = ref(storage, `profileImages/${userId}_${timestamp}.jpg`);

    console.log('Starting Firebase upload...');
    
    // Upload with metadata
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    };

    const uploadResult = await uploadBytes(imageRef, blob, metadata);
    console.log('Upload successful:', uploadResult);

    const downloadURL = await getDownloadURL(imageRef);
    console.log('Download URL obtained:', downloadURL);

    return downloadURL;

  } catch (error: any) {
    console.error('Upload failed:', error);
    
    // Provide specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Upload permission denied. Please check Firebase rules.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed due to network issues. Please try again.');
    } else {
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  }
};

// Cloudinary alternative (if Firebase continues to fail)
export const uploadToCloudinary = async (imageUri: string, userId: string): Promise<string> => {
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
  const UPLOAD_PRESET = 'your_upload_preset';

  try {
    const formData = new FormData();
    
    // Convert image to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    formData.append('file', blob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', `profile_${userId}_${Date.now()}`);
    
    const uploadResponse = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    
    const result = await uploadResponse.json();
    return result.secure_url;
    
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
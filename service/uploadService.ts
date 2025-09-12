import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';

// CORS-free upload function
export const uploadProfileImageNoCORS = async (imageUri: string, userId: string): Promise<string> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    console.log('Starting upload process...');
    
    // Convert image to blob
    let blob: Blob;
    
    if (imageUri.startsWith('data:')) {
      // Handle data URLs
      const response = await fetch(imageUri);
      blob = await response.blob();
    } else {
      // Handle regular image URIs using canvas
      blob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob((result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Canvas to blob conversion failed'));
            }
          }, 'image/jpeg', 0.8);
        };
        
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = imageUri;
      });
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
      throw new Error('Upload permission denied. Check Firebase Storage rules.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  }
};

// Fallback upload function (original method)
export const uploadProfileImage = async (imageUri: string, userId: string): Promise<string> => {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, `profileImages/${userId}_${Date.now()}.jpg`);
    
    // Convert image to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Upload
    const snapshot = await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Original upload method failed:', error);
    throw error;
  }
};
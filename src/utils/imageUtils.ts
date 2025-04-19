import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const resizeImage = (file: File, maxSizeKB: number = 100): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxWidth = 800;
        const maxHeight = 600;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not convert canvas to blob'));
            return;
          }

          if (blob.size > maxSizeKB * 1024) {
            const quality = Math.max(0.1, 0.9 * (maxSizeKB * 1024) / blob.size);
            canvas.toBlob((smallerBlob) => {
              if (!smallerBlob) {
                reject(new Error('Could not create smaller blob'));
                return;
              }
              resolve(smallerBlob);
            }, 'image/jpeg', quality);
          } else {
            resolve(blob);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImageToSupabase = async (file: File, bucketName: string = 'images'): Promise<string> => {
  try {
    console.log("Starting image upload process...");
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required to upload images');
    }
    
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error("Error checking user role:", profileError);
      throw new Error('Could not verify admin privileges');
    }
    
    if (userProfile?.role !== 'admin') {
      throw new Error('Admin privileges required to upload images');
    }
    
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    console.log("Available buckets:", buckets);
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' doesn't exist, creating it...`);
      const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2,
      });
      
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw new Error(`Could not create storage bucket: ${createBucketError.message}`);
      }
      console.log(`Bucket '${bucketName}' created successfully`);
    }
    
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = fileName;

    console.log("Uploading file:", filePath);
    
    let fileToUpload = file;
    if (file.size > 500 * 1024) {
      try {
        const resizedBlob = await resizeImage(file, 500);
        fileToUpload = new File([resizedBlob], file.name, { type: file.type });
        console.log("Image resized for upload:", fileToUpload.size / 1024, "KB");
      } catch (resizeError) {
        console.warn("Could not resize image, uploading original:", resizeError);
      }
    }
    
    let uploadAttempts = 0;
    let data;
    let error;
    
    while (uploadAttempts < 3) {
      ({ data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        }));
        
      if (!error) break;
      
      uploadAttempts++;
      console.log(`Upload attempt ${uploadAttempts} failed:`, error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (error) {
      console.error("Upload error after retries:", error);
      throw error;
    }

    console.log("Upload successful:", data);

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log("Generated public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

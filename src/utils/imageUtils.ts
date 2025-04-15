
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

        // Calculate the scaling factor to reduce file size
        let width = img.width;
        let height = img.height;
        const maxWidth = 800; // Max width for resized image
        const maxHeight = 600; // Max height for resized image

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

        // Convert to blob and check size
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not convert canvas to blob'));
            return;
          }

          // If blob is still too large, reduce quality
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
    
    // Check if bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} does not exist, attempting to create it...`);
      try {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10, // 10MB
        });
        
        if (error) {
          console.error("Error creating bucket:", error);
          throw error;
        }
      } catch (bucketError) {
        console.error("Error creating bucket:", bucketError);
        // Continue anyway, as the bucket might actually exist but we don't have permission to list buckets
      }
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading file:", filePath);
    
    // Resize image before upload to reduce size if it's too large
    let fileToUpload = file;
    if (file.size > 500 * 1024) { // If larger than 500KB, resize it
      try {
        const resizedBlob = await resizeImage(file, 500);
        fileToUpload = new File([resizedBlob], file.name, { type: file.type });
        console.log("Image resized for upload:", fileToUpload.size / 1024, "KB");
      } catch (resizeError) {
        console.warn("Could not resize image, uploading original:", resizeError);
      }
    }
    
    // Upload to Supabase with public access
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload successful:", data);

    // Generate public URL
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log("Generated public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

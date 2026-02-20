import { supabase } from './supabase';

/**
 * Uploads a file from a local URI to a Supabase storage bucket.
 * Works on both web and native platforms.
 */
export async function uploadFile(
  uri: string,
  bucket: string,
  contentType: string = 'image/jpeg',
): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = `${fileName}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    return null;
  }
}

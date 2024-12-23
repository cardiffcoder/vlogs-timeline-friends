import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
}

export const VideoUpload = ({ onVideoUploaded }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) {
        throw new Error('No file selected');
      }

      // Check file size (100MB limit)
      const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 100MB');
      }

      // Create video element to check duration
      const videoElement = document.createElement('video');
      const durationPromise = new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve(videoElement.duration);
        videoElement.onerror = () => reject('Error loading video');
      });

      videoElement.src = URL.createObjectURL(file);
      const duration = await durationPromise;

      if (Number(duration) > 10) {
        throw new Error('Video must be 10 seconds or shorter');
      }

      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      onVideoUploaded(publicUrl);
      
      toast({
        title: "Video uploaded successfully",
        description: "Your video has been uploaded and will be processed shortly.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error uploading video",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload Video (10 seconds or less)</Label>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button 
            variant="secondary" 
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Choose Video'}
          </Button>
        </div>
        {uploading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Uploading video...</span>
          </div>
        )}
      </div>
    </div>
  );
};
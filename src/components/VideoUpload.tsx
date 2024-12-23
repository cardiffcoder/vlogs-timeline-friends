import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Starting video upload:', {
        bucket: 'videos',
        path: filePath,
        fileType: file.type,
        size: file.size,
        userId: session.user.id
      });

      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);
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
      <Label>Upload Video</Label>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <input
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="secondary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Record Video'}
          </Button>
        </div>
        {uploading && <span>Uploading video...</span>}
      </div>
    </div>
  );
};
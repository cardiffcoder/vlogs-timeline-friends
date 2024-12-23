import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProfilePhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
}

export const ProfilePhotoUpload = ({ onPhotoUploaded, currentPhotoUrl }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const { toast } = useToast();
  const defaultAvatarUrl = "/lovable-uploads/dc3f5a45-fb4f-4499-a1ff-66f5113b9983.png";

  // Preload the default avatar image
  React.useEffect(() => {
    const img = new Image();
    img.src = defaultAvatarUrl;
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) {
        throw new Error('No file selected');
      }

      // Log file details
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Attempting to upload file:', filePath);

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL in a separate call
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      onPhotoUploaded(publicUrl);
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your profile photo has been updated.",
      });

    } catch (error) {
      console.error('Detailed error:', error);
      toast({
        title: "Error uploading photo",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Profile Photo</Label>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={preview || defaultAvatarUrl} 
              loading="eager"
              className="object-cover"
            />
            <AvatarFallback>
              <img 
                src={defaultAvatarUrl} 
                alt="Default profile" 
                className="h-full w-full object-cover"
                loading="eager"
              />
            </AvatarFallback>
          </Avatar>
          {!preview && (
            <div className="absolute inset-0 bg-white/15 backdrop-blur-[1.2px] rounded-full brightness-110" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="secondary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Choose Pic'}
            </Button>
          </div>
          {uploading && <span>Uploading...</span>}
        </div>
      </div>
    </div>
  );
};
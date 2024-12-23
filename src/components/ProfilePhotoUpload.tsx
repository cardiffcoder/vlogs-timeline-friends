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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onPhotoUploaded(publicUrl);
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your profile photo has been updated.",
      });

    } catch (error) {
      toast({
        title: "Error uploading photo",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const defaultAvatarUrl = "/lovable-uploads/dc3f5a45-fb4f-4499-a1ff-66f5113b9983.png";

  return (
    <div className="space-y-4">
      <Label>Profile Photo</Label>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || defaultAvatarUrl} />
          <AvatarFallback>
            <img src={defaultAvatarUrl} alt="Default profile" className="h-full w-full object-cover" />
          </AvatarFallback>
        </Avatar>
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
              Choose Pic
            </Button>
          </div>
          {uploading && <span>Uploading...</span>}
        </div>
      </div>
    </div>
  );
};
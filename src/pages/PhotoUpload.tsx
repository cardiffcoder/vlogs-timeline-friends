import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { supabase } from "@/integrations/supabase/client";

const PhotoUpload = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Upload Profile Photo</h1>
          <p className="text-gray-400">Add a photo to personalize your profile</p>
          
          <div className="flex flex-col space-y-4">
            <ProfilePhotoUpload isUploading={isUploading} setIsUploading={setIsUploading} />
            
            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-2">Already have an account?</p>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="w-full"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
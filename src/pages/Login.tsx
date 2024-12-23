import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!avatarUrl) {
      toast({
        title: "Profile photo required",
        description: "Please upload a profile photo to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile created successfully",
        description: "Welcome to the platform!",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error creating profile",
        description: "Please try again.",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Your Profile</h1>
          <p className="text-muted-foreground">Please fill in your details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="johndoe"
            />
          </div>

          <ProfilePhotoUpload
            onPhotoUploaded={(url) => setAvatarUrl(url)}
            currentPhotoUrl={avatarUrl || undefined}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !avatarUrl}
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};
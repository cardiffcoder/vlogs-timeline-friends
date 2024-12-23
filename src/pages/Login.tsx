import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [vlogName, setVlogName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (name.trim()) {
      setVlogName(`${name}'s 2025 Vlog`);
    } else {
      setVlogName('');
    }
  }, [name]);

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
          username: name.toLowerCase().replace(/\s+/g, ''),
          full_name: name,
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
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/lovable-uploads/3717075d-709b-41b3-905a-8d1d59e76824.png")',
          backgroundSize: '100vw 100vh',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.95,
          transform: 'rotate(90deg)',
          width: '100vw',
          height: '100vh'
        }}
      />
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Start your vlog 🤳</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vlogName">Vlog Name</Label>
            <Input
              id="vlogName"
              value={vlogName}
              onChange={(e) => setVlogName(e.target.value)}
              required
              placeholder="Your vlog name"
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
}
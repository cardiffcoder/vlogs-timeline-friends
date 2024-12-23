import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onSubmit: (name: string, vlogName: string) => void;
  isLoading: boolean;
  isLogin?: boolean;
}

export const AuthForm = ({ onSubmit, isLoading, isLogin = false }: AuthFormProps) => {
  const [name, setName] = useState('');
  const [vlogName, setVlogName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, isLogin ? '' : vlogName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!isLogin) {
              setVlogName(`${e.target.value}'s 2025 Vlog`);
            }
          }}
          required
          placeholder="Your name"
        />
      </div>

      {!isLogin && (
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
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (isLogin ? 'Logging in...' : 'Creating Profile...') : (isLogin ? 'Log in' : 'Create Profile')}
      </Button>
    </form>
  );
};
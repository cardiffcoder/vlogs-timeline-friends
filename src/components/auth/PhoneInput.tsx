import React from "react";
import { Input } from "@/components/ui/input";

interface UsernameInputProps {
  username: string;
  setUsername: (name: string) => void;
  isLoading: boolean;
}

export const PhoneInput = ({ 
  username,
  setUsername,
  isLoading 
}: UsernameInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
          placeholder="Enter your username"
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
};
import React from "react";
import { Input } from "@/components/ui/input";

interface NameInputProps {
  fullName: string;
  setFullName: (name: string) => void;
  isLoading: boolean;
}

export const PhoneInput = ({ 
  fullName,
  setFullName,
  isLoading 
}: NameInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
          Full Name
        </label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full"
          placeholder="Enter your full name"
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
};
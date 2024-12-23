import React from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  isLoading: boolean;
}

export const PhoneInput = ({ 
  phoneNumber, 
  setPhoneNumber, 
  password, 
  setPassword,
  fullName,
  setFullName,
  isLoading 
}: PhoneInputProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure it starts with +
    if (value && !value.startsWith('+')) {
      value = '+' + value;
    }
    setPhoneNumber(value);
  };

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

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-200">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="w-full"
          placeholder="+1234567890"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          placeholder="Enter your password"
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
};
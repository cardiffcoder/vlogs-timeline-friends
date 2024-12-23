import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhoneInputProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PhoneInput = ({ phoneNumber, setPhoneNumber, onSubmit, isLoading }: PhoneInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
          Phone Number (Test Mode)
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+15555555555"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full"
          disabled={isLoading}
        />
        <div className="text-sm text-gray-400 mt-1 space-y-1">
          <p>For testing, use one of these formats:</p>
          <ul className="list-disc list-inside">
            <li>US/Canada: +15555555555</li>
            <li>UK: +447777777777</li>
          </ul>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
};
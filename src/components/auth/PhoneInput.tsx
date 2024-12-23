import React from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhoneInputProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  isLoading: boolean;
}

export const PhoneInput = ({ phoneNumber, setPhoneNumber, isLoading }: PhoneInputProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Ensure it starts with +
    if (value && !value.startsWith('+')) {
      value = '+' + value;
    }
    setPhoneNumber(value);
  };

  return (
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
      <Alert>
        <AlertDescription>
          <p className="text-sm">For testing, use a real phone number format:</p>
          <ul className="list-disc list-inside mt-1 text-sm">
            <li>US/Canada: +12025550123</li>
            <li>UK: +447911123456</li>
            <li>Must start with + and country code</li>
            <li>No spaces or special characters</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
import React from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPInputProps {
  otp: string;
  setOTP: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const OTPVerification = ({ otp, setOTP, onSubmit, onBack, isLoading }: OTPInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Enter OTP
        </label>
        <InputOTP
          value={otp}
          onChange={setOTP}
          maxLength={6}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} index={index} />
              ))}
            </InputOTPGroup>
          )}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onBack}
        disabled={isLoading}
      >
        Back to Phone Number
      </Button>
    </form>
  );
};
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it doesn't start with +, add it
    if (!phone.startsWith('+')) {
      return `+${digits}`;
    }
    return phone;
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation: should start with + and have at least 10 digits
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        toast.error("Please enter a valid phone number in international format (e.g., +1234567890)");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setShowOTP(true);
      toast.success("OTP sent to your phone number!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-semibold text-vlogs-text mb-8 text-center">Vlogs</h1>
        
        {!showOTP ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                Phone Number (International Format)
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-400 mt-1">
                Example: +1234567890 (include country code)
              </p>
            </div>
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
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
              />
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowOTP(false)}
            >
              Back to Phone Number
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
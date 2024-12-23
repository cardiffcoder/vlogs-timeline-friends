import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPVerification } from "@/components/auth/OTPInput";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

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
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{10,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number in E.164 format (e.g., +15555555555)",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error("Supabase error:", error);
        
        if (error.message.includes("21211")) {
          toast({
            title: "Configuration Error",
            description: "The SMS service is not properly configured. Please contact support.",
            variant: "destructive",
          });
        } else if (error.message.includes("sms_send_failed")) {
          toast({
            title: "SMS Service Error",
            description: "Failed to send SMS. Please try again later or contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      setShowOTP(true);
      toast({
        title: "Success",
        description: "OTP sent to your phone number!",
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error("OTP verification error:", error);
        
        if (error.message.includes("otp_expired")) {
          toast({
            title: "OTP Expired",
            description: "The verification code has expired. Please request a new one.",
            variant: "destructive",
          });
          setShowOTP(false); // Go back to phone input
        } else {
          toast({
            title: "Error",
            description: "Invalid verification code. Please try again.",
            variant: "destructive",
          });
        }
        setOTP("");
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      setOTP("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-semibold text-vlogs-text mb-8 text-center">Vlogs</h1>
        
        {!showOTP ? (
          <PhoneInput 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onSubmit={handleSendOTP}
            isLoading={isLoading}
          />
        ) : (
          <OTPVerification
            otp={otp}
            setOTP={setOTP}
            onSubmit={handleVerifyOTP}
            onBack={() => setShowOTP(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
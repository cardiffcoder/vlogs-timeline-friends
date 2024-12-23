import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OTPVerification } from "@/components/auth/OTPVerification";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First try to sign in
      const signInResult = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password,
      });

      if (signInResult.error) {
        // If sign in fails and we have a full name, try to sign up
        if (fullName) {
          if (fullName.length < 2) {
            toast({
              title: "Error",
              description: "Full name must be at least 2 characters long",
              variant: "destructive",
            });
            return;
          }

          const signUpResult = await supabase.auth.signUp({
            phone: phoneNumber,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (signUpResult.error) {
            toast({
              title: "Error",
              description: signUpResult.error.message,
              variant: "destructive",
            });
          } else {
            setShowOTP(true);
            toast({
              title: "Success",
              description: "Account created successfully! Please verify your phone number.",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Invalid credentials. If you're new, please provide your full name to sign up.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Phone number verified successfully!",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-semibold text-vlogs-text mb-8 text-center">Vlogs</h1>
        
        {showOTP ? (
          <OTPVerification
            otp={otp}
            setOTP={setOTP}
            onSubmit={handleVerifyOTP}
            onBack={() => setShowOTP(false)}
            isLoading={isLoading}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PhoneInput
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              isLoading={isLoading}
            />

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name (required for new accounts)
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-vlogs-primary"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password (min 6 characters)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-vlogs-primary"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-vlogs-primary text-white py-2 px-4 rounded-md hover:bg-vlogs-primary/90 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign In / Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
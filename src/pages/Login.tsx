import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a random password since Supabase requires one
      const randomPassword = Math.random().toString(36).slice(-12);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password: randomPassword,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        toast({
          title: "Error",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (signUpData.user) {
        // Generate a username from the phone number (removing the + and any spaces)
        const username = phoneNumber.replace(/[+\s]/g, '');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: signUpData.user.id,
            full_name: fullName,
            username: username
          });

        if (profileError) {
          toast({
            title: "Warning",
            description: "Account created but failed to save profile information",
            variant: "destructive",
          });
        }

        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/50 p-8 rounded-lg backdrop-blur-sm border border-gray-800">
        <h1 className="text-3xl font-semibold text-vlogs-text mb-8 text-center">
          Vlogs
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            fullName={fullName}
            setFullName={setFullName}
            isLoading={isLoading}
          />
          <button
            type="submit"
            className="w-full bg-vlogs-primary text-white py-2 px-4 rounded-md hover:bg-vlogs-primary/90 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
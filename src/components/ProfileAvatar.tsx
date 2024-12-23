import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  url?: string | null;
  username: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-24 w-24"
};

export const ProfileAvatar = ({ url, username, size = "md" }: ProfileAvatarProps) => {
  const defaultAvatarUrl = "/placeholder.svg";
  
  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-white`}>
      <AvatarImage 
        src={url || defaultAvatarUrl} 
        alt={username}
        className="object-cover"
      />
      <AvatarFallback>
        <img 
          src={defaultAvatarUrl} 
          alt={username} 
          className="h-full w-full object-cover"
        />
      </AvatarFallback>
    </Avatar>
  );
};
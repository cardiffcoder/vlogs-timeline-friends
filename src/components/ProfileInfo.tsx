import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileInfoProps {
  username: string;
  avatarUrl?: string;
  displayName?: string;
}

export const ProfileInfo = ({ username, avatarUrl, displayName }: ProfileInfoProps) => {
  return (
    <div className="flex items-center gap-2 pl-4 pb-4 scale-[1.2] origin-left">
      <Avatar className="h-8 w-8 border-2 border-white">
        <AvatarImage src={avatarUrl} alt={username} className="object-cover" />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <span className="text-white font-medium drop-shadow-lg">
        {displayName || username}
      </span>
    </div>
  );
};
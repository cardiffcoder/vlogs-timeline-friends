import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="px-4 py-2">
        <div className="flex items-center">
          <h1 className="text-vlogs font-semibold font-poppins text-vlogs-text">Vlogs</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
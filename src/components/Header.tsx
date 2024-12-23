import { Video } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">Vlogs</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
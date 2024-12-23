import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  // Mock data for stories with new photos
  const stories = [
    { id: 1, username: "Sarah", avatarUrl: "/lovable-uploads/93be06b4-bf6e-44c3-b1de-5902e9267580.png", position: "object-[center_65%]" },
    { id: 2, username: "Emily", avatarUrl: "/lovable-uploads/6482916c-eb0b-4cd4-a2ca-a63ed98839c6.png", position: "object-[center_60%] scale-125" },
    { id: 3, username: "Sarah", avatarUrl: "/lovable-uploads/93be06b4-bf6e-44c3-b1de-5902e9267580.png", position: "object-[center_65%]" },
    { id: 4, username: "Eric", avatarUrl: "/lovable-uploads/d5bcff19-c702-4c27-8a44-33ea94a88911.png", position: "object-[center_45%] scale-125" },
    { id: 5, username: "Sarah", avatarUrl: "/lovable-uploads/93be06b4-bf6e-44c3-b1de-5902e9267580.png", position: "object-[center_65%]" },
    { id: 6, username: "Emily", avatarUrl: "/lovable-uploads/6482916c-eb0b-4cd4-a2ca-a63ed98839c6.png", position: "object-[center_60%] scale-125" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="px-4 py-2">
        <div className="flex items-center mb-4">
          <h1 className="text-vlogs font-semibold font-poppins text-vlogs-text">Vlogs</h1>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <div className="p-[2px] rounded-full bg-[#E1F9FC]">
                <Avatar className="h-14 w-14 ring-2 ring-black">
                  <AvatarImage 
                    src={story.avatarUrl} 
                    alt={story.username} 
                    className={`object-cover ${story.position}`}
                  />
                  <AvatarFallback>{story.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs text-gray-300 mt-1">{story.username}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
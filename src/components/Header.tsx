import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  // Mock data for stories with new photos
  const stories = [
    { id: 1, username: "Sarah", avatarUrl: "/lovable-uploads/35a1a878-d132-4beb-97aa-800874b72f57.png", position: "object-[center_45%] scale-110" },
    { id: 2, username: "Qaiss", avatarUrl: "/lovable-uploads/e9bb3af1-e43b-419b-aa6a-6c6ead12f135.png", position: "object-[center_60%] scale-125" },
    { id: 3, username: "Alex", avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png", position: "object-[center_40%] scale-125" },
    { id: 4, username: "Eric", avatarUrl: "/lovable-uploads/d5bcff19-c702-4c27-8a44-33ea94a88911.png", position: "object-[center_45%] scale-125" },
    { id: 5, username: "David", avatarUrl: "/lovable-uploads/fb204798-cabd-430c-9fe1-e0f7b6263477.png", position: "object-[center_50%] scale-125" },
    { id: 6, username: "Kevin", avatarUrl: "/lovable-uploads/b3307dd0-2d1a-4ab8-9418-1043ab388ad4.png", position: "object-[center_45%] scale-110" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-semibold font-poppins text-vlogs-text">Vlogs</h1>
        </div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4 pr-4 scrollbar-hide scale-[1.2] origin-left mt-4">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center scale-140 transform-gpu">
              <div className="rounded-full p-[2px]" style={{ backgroundColor: '#E1F9FC' }}>
                <Avatar className="h-14 w-14 ring-2 ring-[#E1F9FC]">
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  // Mock data for stories with real photos
  const stories = [
    { id: 1, username: "Sarah", avatarUrl: "/lovable-uploads/1c4a25d8-3363-43eb-895d-2a09777dd66c.png" },
    { id: 2, username: "Emily", avatarUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
    { id: 3, username: "Team", avatarUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81" },
    { id: 4, username: "Studio", avatarUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742" },
    { id: 5, username: "Work", avatarUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
    { id: 6, username: "Sarah", avatarUrl: "/lovable-uploads/1c4a25d8-3363-43eb-895d-2a09777dd66c.png" },
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
                  <AvatarImage src={story.avatarUrl} alt={story.username} />
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
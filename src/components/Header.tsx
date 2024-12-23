import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  // Mock data for stories
  const stories = [
    { id: 1, username: "Taylor", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor" },
    { id: 2, username: "Brian", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian" },
    { id: 3, username: "Sophie", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
    { id: 4, username: "Quinn", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn" },
    { id: 5, username: "Alex", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
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
              <div className="p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full">
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
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";

const Index = () => {
  // Mock data for initial display
  const videos = [
    {
      id: 1,
      username: "Sarah",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: new Date(2024, 2, 15, 14, 30),
      description: "Amazing day at the beach! 🌊",
    },
    {
      id: 2,
      username: "Mike",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: new Date(2024, 2, 15, 12, 15),
      description: "Concert night with friends! 🎸",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-0 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              username={video.username}
              avatarUrl={video.avatarUrl}
              videoUrl={video.videoUrl}
              timestamp={video.timestamp}
              description={video.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
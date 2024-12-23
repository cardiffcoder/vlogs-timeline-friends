import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";

const Index = () => {
  // Calculate timestamps relative to current time
  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
  const thirteenMinutesAgo = new Date(now.getTime() - (13 * 60 * 1000));

  // Mock data for initial display
  const videos = [
    {
      id: 1,
      username: "Sarah",
      avatarUrl: "/lovable-uploads/35a1a878-d132-4beb-97aa-800874b72f57.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: sixHoursAgo,
      description: "Amazing day at the beach! 🌊",
    },
    {
      id: 2,
      username: "Qaiss",
      avatarUrl: "/lovable-uploads/e9bb3af1-e43b-419b-aa6a-6c6ead12f135.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: thirteenMinutesAgo,
      description: "Concert night with friends! 🎸",
    },
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-45">
        <div className="w-full mx-auto">
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
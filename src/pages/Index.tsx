import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";

const Index = () => {
  // Calculate timestamps relative to current time
  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
  const thirteenMinutesAgo = new Date(now.getTime() - (13 * 60 * 1000));
  const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
  const fortyMinutesAgo = new Date(now.getTime() - (40 * 60 * 1000));
  const threeHoursAgo = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  const oneHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
  const twentyMinutesAgo = new Date(now.getTime() - (20 * 60 * 1000));

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
    {
      id: 3,
      username: "Alex",
      avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: twoHoursAgo,
      description: "Exploring the city! 🌆",
    },
    {
      id: 4,
      username: "Eric",
      avatarUrl: "/lovable-uploads/d5bcff19-c702-4c27-8a44-33ea94a88911.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: fortyMinutesAgo,
      description: "Coffee break ☕",
    },
    {
      id: 5,
      username: "David",
      avatarUrl: "/lovable-uploads/fb204798-cabd-430c-9fe1-e0f7b6263477.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: threeHoursAgo,
      description: "Workout session 💪",
    },
    {
      id: 6,
      username: "Kevin",
      avatarUrl: "/lovable-uploads/b3307dd0-2d1a-4ab8-9418-1043ab388ad4.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: oneHourAgo,
      description: "Gaming stream highlights 🎮",
    },
    {
      id: 7,
      username: "Sarah",
      avatarUrl: "/lovable-uploads/35a1a878-d132-4beb-97aa-800874b72f57.png",
      videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
      timestamp: twentyMinutesAgo,
      description: "Sunset vibes 🌅",
    }
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
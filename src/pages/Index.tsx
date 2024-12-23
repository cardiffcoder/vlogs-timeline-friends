import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import AddVideoButton from "@/components/AddVideoButton";
import { useState, useEffect } from "react";

const Index = () => {
  // Calculate timestamps relative to current time
  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - (6 * 60 * 60 * 1000));
  const thirteenMinutesAgo = new Date(now.getTime() - (13 * 60 * 1000));
  const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
  const fortyMinutesAgo = new Date(now.getTime() - (40 * 60 * 1000));

  // Initial videos data
  const initialVideos = [
    {
      id: 1,
      username: "TEJES",
      avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
      videoUrl: "/lovable-uploads/6d7ec786-9bb0-45e9-9913-6dd8a840be78.png",
      timestamp: sixHoursAgo,
      description: "Late night vibes with the crew 🌙",
    },
    {
      id: 2,
      username: "DJ Night",
      avatarUrl: "/lovable-uploads/e9bb3af1-e43b-419b-aa6a-6c6ead12f135.png",
      videoUrl: "/lovable-uploads/6ebbc63d-8b76-4e1d-8616-79b60d3b6e0b.png",
      timestamp: thirteenMinutesAgo,
      description: "DJ set going crazy tonight! 🎵",
    },
    {
      id: 3,
      username: "Party Crew",
      avatarUrl: "/lovable-uploads/f8624281-c4d8-4e78-8b29-c0d8ef3ba36a.png",
      videoUrl: "/lovable-uploads/966e87bb-1566-4898-8d09-fab8ddcfc3c2.png",
      timestamp: twoHoursAgo,
      description: "Club nights are the best nights 🎉",
    },
    {
      id: 4,
      username: "Night Out",
      avatarUrl: "/lovable-uploads/d5bcff19-c702-4c27-8a44-33ea94a88911.png",
      videoUrl: "/lovable-uploads/8599db0c-4111-4d04-b006-70c9bd937545.png",
      timestamp: fortyMinutesAgo,
      description: "After party scenes 🌃",
    }
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const [videos, setVideos] = useState(() => {
    // Try to load videos from localStorage on initial render
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos);
      // Convert timestamp strings back to Date objects
      return parsedVideos.map((video: any) => ({
        ...video,
        timestamp: new Date(video.timestamp)
      }));
    }
    return initialVideos;
  });

  // Save videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const handleAddVideo = (newVideoData: {
    username: string;
    avatarUrl: string;
    videoUrl: string;
    description: string;
  }) => {
    const newVideo = {
      ...newVideoData,
      id: videos.length + 1,
      timestamp: new Date(),
    };

    setVideos([newVideo, ...videos]);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <main className="pt-0">
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
      <AddVideoButton onVideoAdd={handleAddVideo} />
    </div>
  );
};

export default Index;
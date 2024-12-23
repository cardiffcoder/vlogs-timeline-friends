import { useState } from "react";
import StoryAvatar from "./StoryAvatar";
import VideoStoriesViewer from "../VideoStoriesViewer";

interface Story {
  id: number;
  username: string;
  avatarUrl: string;
  displayName?: string;
  videoUrl?: string;
  videos?: any[];
}

interface StoriesBarProps {
  stories: Story[];
  currentUser: any;
}

const StoriesBar = ({ stories, currentUser }: StoriesBarProps) => {
  const [selectedStoryVideos, setSelectedStoryVideos] = useState<any[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const handleStoryClick = (story: Story) => {
    if (story.videos && story.videos.length > 0) {
      setSelectedStoryVideos(story.videos);
      setSelectedUsername(story.username);
      setIsViewerOpen(true);
    }
  };

  // Only show stories for users who have videos
  const validStories = stories.filter(story => {
    if (story.username === currentUser?.username) return true;
    return story.videos && story.videos.length > 0;
  });

  return (
    <>
      <div className="flex space-x-6 overflow-x-auto pb-4 pr-4 scrollbar-hide scale-[1.2] origin-left mt-6">
        {validStories.map((story) => {
          const firstVideo = story.videos?.[0];
          return (
            <StoryAvatar
              key={story.id}
              username={story.username}
              displayName={story.displayName || story.username}
              avatarUrl={story.avatarUrl}
              videoUrl={firstVideo?.video_url}
              isCurrentUser={currentUser?.username === story.username}
              onClick={() => handleStoryClick(story)}
              hasVideos={story.videos && story.videos.length > 0}
            />
          );
        })}
      </div>

      {isViewerOpen && selectedStoryVideos.length > 0 && (
        <VideoStoriesViewer
          videos={selectedStoryVideos.map(video => ({
            ...video,
            username: selectedUsername || '',
            avatarUrl: stories.find(s => s.username === selectedUsername)?.avatarUrl || '',
            displayName: stories.find(s => s.username === selectedUsername)?.displayName || selectedUsername
          }))}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedStoryVideos([]);
            setSelectedUsername(null);
          }}
        />
      )}
    </>
  );
};

export default StoriesBar;
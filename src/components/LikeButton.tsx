import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LikeButtonProps {
  videoId: number;
  initialLikeCount?: number;
}

const LikeButton = ({ videoId, initialLikeCount = 0 }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { toast } = useToast();

  useEffect(() => {
    checkIfLiked();
    getLikeCount();
    subscribeToLikes();
  }, [videoId]);

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: likes } = await supabase
      .from('likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', session.user.id)
      .single();

    setIsLiked(!!likes);
  };

  const getLikeCount = async () => {
    const { count } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('video_id', videoId);

    setLikeCount(count || 0);
  };

  const subscribeToLikes = () => {
    const channel = supabase
      .channel('likes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes', filter: `video_id=eq.${videoId}` },
        () => {
          getLikeCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleLike = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like videos",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', session.user.id);
        setIsLiked(false);
      } else {
        await supabase
          .from('likes')
          .insert([
            { video_id: videoId, user_id: session.user.id }
          ]);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 p-1 hover:bg-gray-100/10 rounded-full transition-colors"
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
      />
      <span className="text-white text-sm">{likeCount}</span>
    </button>
  );
};

export default LikeButton;
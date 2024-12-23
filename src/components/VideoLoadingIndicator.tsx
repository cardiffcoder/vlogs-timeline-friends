const VideoLoadingIndicator = () => {
  return (
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default VideoLoadingIndicator;
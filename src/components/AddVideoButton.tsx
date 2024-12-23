const AddVideoButton = ({ onVideoAdd }: { onVideoAdd: () => void }) => (
  <div className="fixed bottom-4 right-4 z-50">
    <img 
      src="/lovable-uploads/964d6cf8-df84-48fa-a72d-9e05551730c1.png" 
      alt="Add video"
      className="cursor-pointer opacity-90 hover:opacity-75 transition-opacity w-[80px] h-[108px]"
      onClick={onVideoAdd}
      loading="eager"
    />
  </div>
);

export default AddVideoButton;
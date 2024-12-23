import { Plus } from "lucide-react";

interface AddVideoButtonProps {
  onVideoAdd: () => void;
}

const AddVideoButton = ({ onVideoAdd }: AddVideoButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4 mb-[1px] mr-[1px] z-50">
      <img 
        src="/lovable-uploads/964d6cf8-df84-48fa-a72d-9e05551730c1.png" 
        alt="Add video"
        className="cursor-pointer hover:opacity-90 transition-opacity scale-[0.25]"
        onClick={onVideoAdd}
      />
    </div>
  );
};

export default AddVideoButton;
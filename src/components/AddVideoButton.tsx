import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddVideoButtonProps {
  onVideoAdd: () => void;
}

const AddVideoButton = ({ onVideoAdd }: AddVideoButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onVideoAdd}
        size="lg"
        className="rounded-full w-14 h-14 bg-vlogs-text/30 hover:bg-vlogs-text/60 shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AddVideoButton;
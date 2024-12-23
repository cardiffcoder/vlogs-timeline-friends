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
        className="rounded-full w-14 h-14 bg-gradient-to-b from-vlogs-text/20 to-vlogs-text/30 hover:from-vlogs-text/30 hover:to-vlogs-text/40 backdrop-blur-sm shadow-xl border border-vlogs-text/20"
        style={{
          backgroundImage: `url('/lovable-uploads/964d6cf8-df84-48fa-a72d-9e05551730c1.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Plus className="h-6 w-6 text-vlogs-text" />
      </Button>
    </div>
  );
};

export default AddVideoButton;
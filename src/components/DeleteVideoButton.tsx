import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteVideoButtonProps {
  onClick: () => void;
}

const DeleteVideoButton = ({ onClick }: DeleteVideoButtonProps) => (
  <Button
    variant="destructive"
    size="icon"
    onClick={onClick}
    className="h-8 w-8"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

export default DeleteVideoButton;
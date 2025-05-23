import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { PencilIcon } from "lucide-react";
import { CategoryListActionsProps } from "@/interfaces/category";
import { useConfirmStore } from "@/store/confirm-store";
import { useModalStore } from "@/store/modal-store";
import { useCategoryStore } from "@/store/category-store";

const CategoryListActions = ({ cat }: CategoryListActionsProps) => {
  const { setDeleteData, setEditData, loading } = useCategoryStore();
  const { openConfirm } = useConfirmStore();
  const { setOpen } = useModalStore();

  const handleClick = (action: "edit" | "delete") => {
    if (loading) return;

    if (action === "edit") {
      setEditData(cat);
      setOpen(true);
    } else {
      setDeleteData(cat);
      openConfirm();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button 
        size="icon" 
        variant="outline" 
        onClick={() => handleClick("edit")} 
        className="h-9 w-9 border hover:bg-accent hover:text-primary text-primary cursor-pointer"
        disabled={loading}
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
      <Button 
        size="icon" 
        variant="destructive" 
        onClick={() => handleClick("delete")} 
        className="h-9 w-9 cursor-pointer"
        disabled={loading}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CategoryListActions;

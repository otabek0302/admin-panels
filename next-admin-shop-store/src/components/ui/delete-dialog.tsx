import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const DeleteDialog = ({ message, title, action, cancel, onConfirm, open, setOpen }: { message: string; title: string; action: string; cancel: string; onConfirm: () => void; open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-white" onClick={() => setOpen(false)}>
            {cancel}
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer bg-red-500 hover:bg-red-600 dark:text-white" onClick={() => onConfirm()}>
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;   
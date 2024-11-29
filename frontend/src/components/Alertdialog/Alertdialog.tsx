import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useRoomStore from "@/store/useRoomStore";

const Alertdialog = ({
  message,
  isOpen,
  setOpen,
  onConfirm,
}: {
  message: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}) => {
  const { isLoading } = useRoomStore();

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Return
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alertdialog;

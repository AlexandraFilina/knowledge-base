import * as Dialog from "@radix-ui/react-dialog";
import { IProjectFormValues } from "../../interfaces/IProjectFormValues";
import ProjectForm from "../../components/ProjectForm";

export interface IProjectDialogProps {
  title: string;
  buttonText: string;
  onSave: (data: IProjectFormValues) => void;
  defaultValues?: IProjectFormValues;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDialog({
  title,
  buttonText,
  onSave,
  defaultValues,
  isOpen,
  onClose,
}: IProjectDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleSubmit = (data: IProjectFormValues) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-stone-200 bg-white p-6 sm:p-8 shadow-xl rounded-2xl">
          <Dialog.Title className="font-serif text-2xl font-semibold text-stone-900">
            {title}
          </Dialog.Title>

          <ProjectForm
            isOpen={isOpen}
            defaultValues={defaultValues}
            submitText={buttonText}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full bg-white/80 border border-stone-200 p-1 opacity-70 hover:opacity-100 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:pointer-events-none"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { IProjectFormValues } from "../../interfaces/IProjectFormValues";
import ProjectForm from "../../components/ProjectForm";
import { useState, useEffect } from "react";

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
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setResetKey((prev) => prev + 1);
    }
  }, [isOpen, defaultValues]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl">
          <Dialog.Title className="text-2xl font-bold text-gray-800 border-b pb-2">
            {title}
          </Dialog.Title>

          <ProjectForm
            defaultValues={defaultValues}
            onSave={onSave}
            buttonText={buttonText}
            onClose={onClose}
            resetKey={resetKey}
          />

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:pointer-events-none"
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

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IProjectFormValues } from "../../interfaces/IProjectFormValues";
import ChipsInput from "../../../../ui/chips-input/ChipsInput";

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
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IProjectFormValues>({
    defaultValues: defaultValues,
    values: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    register("tags");
  }, [register]);

  const tagsArray = watch("tags", defaultValues?.tags);

  useEffect(() => {
    if (isOpen) {
      reset(
        defaultValues || { title: "", description: "", tags: [], progress: 0 }
      );
    }
  }, [isOpen, defaultValues, reset]);

  const handleTagsChange = (value: string[]) => {
    setValue("tags", value, { shouldValidate: true, shouldDirty: true });
  };

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

          <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Project Name
              </label>

              <input
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 resize-none"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 2,
                    message: "Title must be at least 2 characters",
                  },
                })}
                placeholder="e.g. History Exam Preparation"
              />
              {errors.title && (
                <span className="text-sm text-red-500 ml-1">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Description
              </label>

              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                })}
                placeholder="Reviewing major events of the 20th century..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 resize-none"
              />
              {errors.description && (
                <span className="text-sm text-red-500 ml-1">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Progress
              </label>

              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 resize-none"
                {...register("progress", {
                  required: "Progress is required",
                  min: {
                    value: 0,
                    message: "Progress must be at least 0",
                  },
                  max: {
                    value: 100,
                    message: "Progress cannot exceed 100",
                  },
                  valueAsNumber: true,
                })}
                placeholder="0-100"
              />
              {errors.progress && (
                <span className="text-sm text-red-500 ml-1">
                  {errors.progress.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Tags
              </label>

              <ChipsInput
                defaultChips={tagsArray}
                onChange={handleTagsChange}
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {buttonText}
              </button>
            </div>
          </form>

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

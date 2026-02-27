import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { IProjectFormValues } from "../interfaces/IProjectFormValues";
import ChipsInput from "../../../ui/chips-input/ChipsInput";

export interface ProjectFormProps {
  isOpen: boolean;
  defaultValues?: IProjectFormValues;
  submitText: string;
  onSubmit: (data: IProjectFormValues) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  isOpen,
  defaultValues,
  submitText,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IProjectFormValues>({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Project Name
        </label>

        <input
          className="w-full px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
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
          <span className="text-xs text-rose-700 mt-1">
            {errors.title.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
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
          className="w-full px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
        />
        {errors.description && (
          <span className="text-xs text-rose-700 mt-1">
            {errors.description.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Progress
        </label>

        <input
          type="number"
          className="w-full px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
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
          <span className="text-xs text-rose-700 mt-1">
            {errors.progress.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Tags
        </label>

        <ChipsInput defaultChips={tagsArray} onChange={handleTagsChange} />
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-full px-5 py-2.5 text-sm font-semibold transition"
        >
          Cancel
        </button>

        <button
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}

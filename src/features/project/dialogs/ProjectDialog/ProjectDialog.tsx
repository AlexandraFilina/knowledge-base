import { useForm } from "react-hook-form";
import { useState, KeyboardEvent } from "react";
import "./ProjectDialog.css";
import { IProjectFormValues } from "../../interfaces/IProjectFormValues";
import ReactDOM from "react-dom";
import { useEffect } from "react";
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
  const portalNode = document.getElementById("portal");

  if (!portalNode) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<IProjectFormValues>({
      defaultValues: defaultValues,
      values: defaultValues,
    });

  useEffect(() => {
    register("tags");
  }, [register]);

  const tagsArray = watch("tags", defaultValues?.tags);

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || { title: "", description: "", tags: [] });
    }
  }, [isOpen, defaultValues, reset]);

  const handleTagsChange = (value: string[]) => {
    console.log(value);

    setValue("tags", value);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-50"
      onClick={(e) => {
        onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          {title}
        </h2>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Project Name
            </label>

            <input
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 resize-none"
              {...register("title", { required: true })}
              placeholder="e.g. History Exam Preparation"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Description
            </label>

            <textarea
              {...register("description")}
              placeholder="Reviewing major events of the 20th century..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50/50 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Tags
            </label>

            <ChipsInput defaultChips={tagsArray} onChange={handleTagsChange} />
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg"
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    portalNode
  );
}

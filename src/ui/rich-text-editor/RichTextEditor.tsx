import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none min-h-[150px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-stone-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-stone-100 border-b border-stone-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("bold")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm font-medium italic transition ${
            editor.isActive("italic")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-sm font-medium line-through transition ${
            editor.isActive("strike")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          S
        </button>
        <div className="w-px h-6 bg-stone-300 mx-1" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("heading", { level: 3 })
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-stone-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("bulletList")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("orderedList")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition ${
            editor.isActive("codeBlock")
              ? "bg-stone-300 text-stone-900"
              : "text-stone-600 hover:bg-stone-200"
          }`}
        >
          {"</>"}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

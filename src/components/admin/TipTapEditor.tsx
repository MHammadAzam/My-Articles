"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Write your essay here, or paste directly from ChatGPT or Word...",
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#8F5D24] underline underline-offset-4",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-6 mx-auto shadow-sm",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "article-prose min-h-[420px] focus:outline-none p-6 sm:p-8 bg-white rounded-b-xl border border-t-0 border-[#E5E0D8]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="h-[420px] bg-white rounded-xl border border-[#E5E0D8] animate-pulse flex items-center justify-center text-[#8A847A] text-sm font-sans">
        Initializing editorial writing studio...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="tiptap-container w-full rounded-xl overflow-hidden shadow-xs border border-[#E5E0D8]">
      {/* Sticky Top Formatting Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-[#F7F4EE] border-b border-[#E5E0D8]">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Heading 1"
        >
          <Heading1 size={17} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Heading 2"
        >
          <Heading2 size={17} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Heading 3"
        >
          <Heading3 size={17} />
        </button>

        <span className="w-px h-5 bg-[#DCD5C9] mx-1" />

        {/* Inline styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("bold")
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("italic")
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("underline")
              ? "bg-[#E2DDD3] text-[#171614] font-bold"
              : "text-[#5C574F]"
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>

        <span className="w-px h-5 bg-[#DCD5C9] mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("bulletList")
              ? "bg-[#E2DDD3] text-[#171614]"
              : "text-[#5C574F]"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("orderedList")
              ? "bg-[#E2DDD3] text-[#171614]"
              : "text-[#5C574F]"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("blockquote")
              ? "bg-[#E2DDD3] text-[#171614]"
              : "text-[#5C574F]"
          }`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <span className="w-px h-5 bg-[#DCD5C9] mx-1" />

        {/* Media & Links */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-[#EBE6DD] transition-colors ${
            editor.isActive("link")
              ? "bg-[#E2DDD3] text-[#171614]"
              : "text-[#5C574F]"
          }`}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-[#EBE6DD] text-[#5C574F] transition-colors"
          title="Insert Image URL"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-1.5 rounded hover:bg-[#EBE6DD] text-[#5C574F] transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting size={16} />
        </button>

        <span className="w-px h-5 bg-[#DCD5C9] mx-1" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-[#EBE6DD] text-[#5C574F] disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-[#EBE6DD] text-[#5C574F] disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
  });

  async function handleSubmit(published) {
    setLoading(true);
    const content = editor.getHTML();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, slug, published }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(published ? `/blog/${data.slug}` : "/dashboard");
    }
  }

  if (!session)
    return (
      <div className="text-center py-20 text-neutral-400">
        You need to{" "}
        <a href="/login" className="underline text-neutral-900 dark:text-white">
          sign in
        </a>{" "}
        to write.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        New Post
      </h1>

      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold border-0 border-b border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-300 focus:outline-none py-2"
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 flex-wrap">
        {[
          {
            label: "B",
            action: () => editor.chain().focus().toggleBold().run(),
          },
          {
            label: "I",
            action: () => editor.chain().focus().toggleItalic().run(),
          },
          {
            label: "H2",
            action: () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: "H3",
            action: () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
          },
          {
            label: "• List",
            action: () => editor.chain().focus().toggleBulletList().run(),
          },
          {
            label: "Code",
            action: () => editor.chain().focus().toggleCode().run(),
          },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="text-xs px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="min-h-[300px] border border-neutral-200 dark:border-neutral-400 rounded-lg p-4 prose prose-neutral dark:prose-invert max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || !title}
          className="text-sm px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white transition-all disabled:opacity-40"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading || !title}
          className="text-sm px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

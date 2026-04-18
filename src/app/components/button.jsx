"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LikeButton({ slug, initialLikes, initialLiked }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!session) return router.push("/login");
    setLoading(true);

    const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    const data = await res.json();

    setLiked(data.liked);
    setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        liked
          ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
          : "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>
        {likes} {likes === 1 ? "like" : "likes"}
      </span>
    </button>
  );
}

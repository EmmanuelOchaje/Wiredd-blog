"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function Comment({ comment, slug, onReply }) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReply() {
    if (!reply.trim()) return;
    setLoading(true);
    await onReply(reply, comment.id);
    setReply("");
    setShowReply(false);
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
          {comment.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {comment.author?.name}
            </span>
            <span className="text-xs text-neutral-400">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {comment.content}
          </p>
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white mt-1 transition-colors"
          >
            Reply
          </button>

          {showReply && (
            <div className="mt-2 flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 bg-transparent text-neutral-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleReply}
                disabled={loading}
                className="text-sm px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-11 space-y-3 border-l border-neutral-200 dark:border-neutral-800 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                {reply.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {reply.author?.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(reply.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Comments({ slug }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}/comments`)
      .then((r) => r.json())
      .then(setComments);
  }, [slug]);

  async function handleComment(text, parentId = null) {
    setLoading(true);
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, parentId }),
    });
    const newComment = await res.json();

    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c,
        ),
      );
    } else {
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    }
    setLoading(false);
  }

  return (
    <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-8">
      <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
        Comments ({comments.length})
      </h2>

      {session ? (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
            {session.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
            />
            <button
              onClick={() => handleComment(content)}
              disabled={loading || !content.trim()}
              className="text-sm px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "..." : "Post"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-neutral-400">
          <Link
            href="/login"
            className="text-neutral-900 dark:text-white font-medium hover:underline"
          >
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      <div className="space-y-6">
        {comments.length === 0 && (
          <p className="text-sm text-neutral-400">
            No comments yet. Be the first.
          </p>
        )}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            slug={slug}
            onReply={handleComment}
          />
        ))}
      </div>
    </div>
  );
}

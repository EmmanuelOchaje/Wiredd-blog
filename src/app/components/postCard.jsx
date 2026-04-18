import Link from "next/link";

const getGradient = (title) => {
  const gradients = [
    ["#7c3aed", "#4f46e5"],
    ["#fb7185", "#f97316"],
    ["#34d399", "#14b8a6"],
    ["#38bdf8", "#3b82f6"],
    ["#fbbf24", "#f97316"],
    ["#f472b6", "#fb7185"],
  ];
  const index = title?.charCodeAt(0) % gradients.length || 0;
  return gradients[index];
};

export default function PostCard({ post }) {
  const [from, to] = getGradient(post.title);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all">
        <div
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          className="w-full h-48"
        />
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-sm leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <img
              src={post.author?.avatar || "/default-avatar.png"}
              alt={post.author?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {post.author?.name}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 ml-auto">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

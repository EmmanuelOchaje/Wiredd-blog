import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all">
        <div className="w-full h-48 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          {post.cover ? (
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
              No cover
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-sm leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-3">
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

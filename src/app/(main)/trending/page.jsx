import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getTrendingPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { views: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export default async function TrendingPage() {
  const posts = await getTrendingPosts();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Trending
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Most viewed posts in the community
        </p>
      </div>

      {posts.map((post, index) => (
        <Link href={`/blog/${post.slug}`} key={post.id}>
          <div className="flex items-center gap-5 mb-2 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group">
            {/* Cover */}
            <div className="w-40 h-28 shrink-0">
              {post.cover ? (
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `hsl(${(post.title?.charCodeAt(0) * 10) % 360}, 60%, 40%)`,
                  }}
                >
                  <span className="text-4xl font-bold text-white/30 select-none">
                    {post.title?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Rank + Content */}
            <div className="flex items-center gap-4 flex-1 py-4 pr-5">
              <span className="text-2xl font-bold text-neutral-200 dark:text-neutral-700 w-8 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">
                    {post.author?.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                  <span>{post.views} views</span>
                  <span>{post._count.likes} likes</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

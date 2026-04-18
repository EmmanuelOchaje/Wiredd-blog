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

      {posts.length === 0 ? (
        <p className="text-center text-neutral-400">No trending posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <div className="flex items-center gap-5 border border-neutral-200 dark:border-neutral-800 rounded-xl px-5 py-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group">
                {/* Rank */}
                <span className="text-2xl font-bold text-neutral-200 dark:text-neutral-700 w-8 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-400">
                      {post.author?.name}
                    </span>
                    {post.tags.slice(0, 2).map(({ tag }) => (
                      <span key={tag.id} className="text-xs text-neutral-400">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 shrink-0 text-xs text-neutral-400">
                  <span>{post.views} views</span>
                  <span>{post._count.likes} likes</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

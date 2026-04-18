import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export default async function ExplorePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
          Explore
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          All posts from the Wiredd community
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-neutral-400">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col gap-3">
              <Link href={`/blog/${post.slug}`}>
                <div className="w-full h-52 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {post.cover ? (
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                      No cover
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex flex-col gap-2">
                {post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map(({ tag }) => (
                      <span key={tag.id} className="text-xs text-neutral-400">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-semibold text-neutral-900 dark:text-white text-sm leading-snug group-hover:text-neutral-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {post.author?.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-neutral-900 dark:text-white hover:opacity-70 transition-all"
                >
                  Learn More ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

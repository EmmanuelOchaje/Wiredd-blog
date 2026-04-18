import { prisma } from "../../../../lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({ params }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, bio: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post || !post.published) return notFound();

  // increment views
  await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {post.author?.name}
          </p>
          <p className="text-xs text-neutral-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {post.readTime && ` · ${post.readTime} min read`}
            {` · ${post.views} views`}
          </p>
        </div>
      </div>

      {/* Cover */}
      {post.cover && (
        <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative">
        <div
          className={`prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed ${!isLoggedIn ? "line-clamp-[12] pointer-events-none select-none" : ""}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Soft gate */}
        {!isLoggedIn && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#18181b] to-transparent flex flex-col items-center justify-end pb-4">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Join Wiredd to keep reading
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="text-sm px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="text-sm px-5 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:border-neutral-900 dark:hover:border-white transition-all"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Author bio */}
      {isLoggedIn && post.author?.bio && (
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-start gap-4">
          <img
            src={post.author?.avatar || "/default-avatar.png"}
            alt={post.author?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {post.author?.name}
            </p>
            <p className="text-xs text-neutral-400 mt-1">{post.author?.bio}</p>
          </div>
        </div>
      )}
    </article>
  );
}

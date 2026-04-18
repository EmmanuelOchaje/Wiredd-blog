import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { likes: true, comments: true } } },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        <Link
          href="/write"
          className="text-sm px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          + New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: user.posts.length },
          {
            label: "Published",
            value: user.posts.filter((p) => p.published).length,
          },
          {
            label: "Drafts",
            value: user.posts.filter((p) => !p.published).length,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-neutral-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">
          Your Posts
        </h2>
        {user.posts.length === 0 && (
          <p className="text-neutral-400 text-sm">
            No posts yet.{" "}
            <Link href="/write" className="underline">
              Write your first one.
            </Link>
          </p>
        )}
        {user.posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between border border-neutral-200 dark:border-neutral-800 rounded-xl px-5 py-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all"
          >
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {post.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"}`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-neutral-400">
                  {post._count.likes} likes · {post._count.comments} comments ·{" "}
                  {post.views} views
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                View
              </Link>
              <Link
                href={`/write?edit=${post.slug}`}
                className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Edit
              </Link>
              <DeleteButton postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteButton({ postId }) {
  return (
    <form
      action={async () => {
        "use server";
        const { prisma } = await import("@/lib/prisma");
        await prisma.post.delete({ where: { id: postId } });
        const { revalidatePath } = await import("next/cache");
        const { redirect } = await import("next/navigation");
        revalidatePath("/dashboard");
        redirect("/dashboard");
      }}
    >
      <button
        type="submit"
        className="text-xs text-red-400 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </form>
  );
}

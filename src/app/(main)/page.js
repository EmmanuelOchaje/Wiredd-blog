import Link from "next/link";
import { prisma } from "../../lib/prisma";

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

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
    take: 9,
  });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="space-y-16">
      {/* Hero heading */}
      <section className="text-center pt-12 pb-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:w-xl mx-auto md:text-5xl font-semibold text-neutral-800 dark:text-white leading-tight tracking-tight">
          Stories, rants and experiences for techies
        </h1>
        <p className="text-neutral-400 mt-2 text-sm md:text-base">
          Real talk from developers, designers, founders and every kind of tech
          person.
        </p>
      </section>

      {/* Posts grid */}
      <section>
        <div className="grid grid-cols-1 max-w-5xl mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col gap-3">
              {/* Gradient */}
              <Link href={`/blog/${post.slug}`}>
                <div className="w-full h-52 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
                      <span className="text-7xl font-bold text-white/30 select-none">
                        {post.title?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-semibold text-neutral-800 dark:text-white text-sm leading-snug group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-800 dark:text-white hover:gap-2 transition-all"
                >
                  Learn More ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

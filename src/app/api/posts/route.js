import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function fetchCover(title) {
  const keywords = title.split(" ").slice(0, 3).join(" ");
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords + " technology")}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.urls?.regular || null;
}

function calculateReadTime(content) {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, content, slug, published } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const cover = await fetchCover(title);

    const readTime = calculateReadTime(content);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published,
        cover,
        authorId: user.id,
        readTime,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

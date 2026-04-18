import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { title, excerpt, cover, content, slug, published } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      published,
      authorId: user.id,
    },
  });

  return NextResponse.json(post, { status: 201 });
}

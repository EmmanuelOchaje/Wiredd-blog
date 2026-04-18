import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return NextResponse.json([], { status: 200 });

  const comments = await prisma.comment.findMany({
    where: { postId: post.id, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      replies: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req, { params }) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { content, parentId } = await req.json();

  if (!content?.trim())
    return NextResponse.json({ message: "Content required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!user || !post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: user.id,
      postId: post.id,
      parentId: parentId || null,
    },
    include: {
      author: { select: { name: true } },
      replies: { include: { author: { select: { name: true } } } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}

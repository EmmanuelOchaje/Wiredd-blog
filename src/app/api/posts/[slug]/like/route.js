import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || !user)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: user.id, postId: post.id } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId: user.id, postId: post.id } },
    });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { userId: user.id, postId: post.id } });
    return NextResponse.json({ liked: true });
  }
}

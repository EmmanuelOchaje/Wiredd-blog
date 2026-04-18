import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { title, content, published } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || post.authorId !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const updated = await prisma.post.update({
    where: { slug },
    data: { title, content, published },
  });

  return NextResponse.json(updated);
}

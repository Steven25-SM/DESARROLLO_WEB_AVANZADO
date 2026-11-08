
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Listar libros y filtrar por género
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");

    const books = await prisma.book.findMany({
      where: genre
        ? { genre: { equals: genre, mode: "insensitive" } }
        : undefined,
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(books);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener libros" },
      { status: 500 }
    );
  }
}

// POST: Registrar libro
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.authorId) {
      return NextResponse.json(
        { error: "El título y el autor son obligatorios" },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description,
        isbn: body.isbn || null,
        publishedYear: body.publishedYear
          ? Number(body.publishedYear)
          : null,
        genre: body.genre,
        pages: body.pages ? Number(body.pages) : null,
        authorId: body.authorId,
      },
      include: { author: true },
    });

    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo registrar el libro. Verifica el autor y el ISBN." },
      { status: 400 }
    );
  }
}

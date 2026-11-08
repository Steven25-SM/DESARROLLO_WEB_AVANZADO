
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

// GET: Obtener todos los libros de un autor
export async function GET(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    // Verificar que el autor exista
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    // Obtener sus libros
    const books = await prisma.book.findMany({
      where: { authorId: id },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(books);

  } catch (error) {
    console.error("Error al obtener libros del autor:", error);

    return NextResponse.json(
      { error: "Error al obtener los libros del autor" },
      { status: 500 }
    );
  }
}

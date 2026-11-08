
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

// GET: Obtener libro por ID
export async function GET(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Libro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error al obtener libro:", error);

    return NextResponse.json(
      { error: "Error al obtener libro" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar libro
export async function PUT(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        isbn: body.isbn,
        publishedYear: body.publishedYear !== undefined
          ? (body.publishedYear === null || body.publishedYear === ""
              ? null
              : Number(body.publishedYear))
          : undefined,
        genre: body.genre,
        pages: body.pages !== undefined
          ? (body.pages === null || body.pages === ""
              ? null
              : Number(body.pages))
          : undefined,
        authorId: body.authorId,
      },
      include: { author: true },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error al actualizar libro:", error);

    return NextResponse.json(
      { error: "No se pudo actualizar el libro" },
      { status: 400 }
    );
  }
}

// DELETE: Eliminar libro
export async function DELETE(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Libro eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar libro:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar el libro" },
      { status: 404 }
    );
  }
}

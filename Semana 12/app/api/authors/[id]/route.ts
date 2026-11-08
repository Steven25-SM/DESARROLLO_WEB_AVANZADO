
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

// GET: Obtener un autor por ID
export async function GET(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            title: "asc",
          },
        },
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error("Error al obtener autor:", error);

    return NextResponse.json(
      { error: "Error al obtener autor" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un autor
export async function PUT(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const author = await prisma.author.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        bio: body.bio,
        nationality: body.nationality,
        birthYear: body.birthYear,
      },
    });

    return NextResponse.json(author);
  } catch (error) {
    console.error("Error al actualizar autor:", error);

    return NextResponse.json(
      { error: "Error al actualizar autor" },
      { status: 400 }
    );
  }
}

// DELETE: Eliminar un autor
export async function DELETE(
  request: NextRequest,
  { params }: Context
) {
  try {
    const { id } = await params;

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Autor eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar autor:", error);

    return NextResponse.json(
      { error: "Error al eliminar autor" },
      { status: 400 }
    );
  }
}

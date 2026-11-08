
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    // 1. Buscar autor y sus libros
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          orderBy: {
            publishedYear: "asc",
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

    const books = author.books;

    // 2. Filtrar libros que tienen año de publicación
    const booksWithYear = books
      .filter((book) => book.publishedYear !== null)
      .sort(
        (a, b) =>
          a.publishedYear! - b.publishedYear!
      );

    // 3. Filtrar libros que tienen páginas registradas
    const booksWithPages = books.filter(
      (book) => book.pages !== null
    );

    // 4. Calcular promedio de páginas
    const totalPages = booksWithPages.reduce(
      (sum, book) => sum + book.pages!,
      0
    );

    const averagePages = booksWithPages.length > 0
      ? Math.round(totalPages / booksWithPages.length * 100) / 100
      : 0;

    // 5. Obtener géneros únicos
    const genres = [
      ...new Set(
        books
          .map((book) => book.genre)
          .filter((genre): genre is string => Boolean(genre))
      ),
    ];

    // 6. Encontrar libro más largo
    const longestBook = booksWithPages.length > 0
      ? [...booksWithPages].sort(
          (a, b) => b.pages! - a.pages!
        )[0]
      : null;

    // 7. Encontrar libro más corto
    const shortestBook = booksWithPages.length > 0
      ? [...booksWithPages].sort(
          (a, b) => a.pages! - b.pages!
        )[0]
      : null;

    // 8. Respuesta final
    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,

      firstBook: booksWithYear.length > 0
        ? {
            title: booksWithYear[0].title,
            year: booksWithYear[0].publishedYear,
          }
        : null,

      latestBook: booksWithYear.length > 0
        ? {
            title: booksWithYear[booksWithYear.length - 1].title,
            year: booksWithYear[booksWithYear.length - 1].publishedYear,
          }
        : null,

      averagePages,

      genres,

      longestBook: longestBook
        ? {
            title: longestBook.title,
            pages: longestBook.pages,
          }
        : null,

      shortestBook: shortestBook
        ? {
            title: shortestBook.title,
            pages: shortestBook.pages,
          }
        : null,
    });

  } catch (error) {
    console.error("Error al obtener estadísticas:", error);

    return NextResponse.json(
      { error: "Error al obtener estadísticas del autor" },
      { status: 500 }
    );
  }
}

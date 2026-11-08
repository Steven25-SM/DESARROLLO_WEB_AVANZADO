
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SORT_FIELDS = ["title", "publishedYear", "createdAt"] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Obtener parámetros
    const search = searchParams.get("search")?.trim() || "";
    const genre = searchParams.get("genre")?.trim() || "";
    const authorName = searchParams.get("authorName")?.trim() || "";

    const pageParam = Number(searchParams.get("page") || 1);
    const limitParam = Number(searchParams.get("limit") || 10);

    const page = Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

    const limit = Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 50)
      : 10;

    const requestedSort = searchParams.get("sortBy") || "createdAt";
    const sortBy = SORT_FIELDS.includes(
      requestedSort as typeof SORT_FIELDS[number]
    )
      ? requestedSort as typeof SORT_FIELDS[number]
      : "createdAt";

    const requestedOrder = searchParams.get("order");
    const order = requestedOrder === "asc" ? "asc" : "desc";

    // 2. Construir filtros
    const where = {
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),

      ...(genre && {
        genre: {
          equals: genre,
        },
      }),

      ...(authorName && {
        author: {
          name: {
            contains: authorName,
            mode: "insensitive" as const,
          },
        },
      }),
    };

    // 3. Consultar resultados y total simultáneamente
    const [books, total] = await prisma.$transaction([
      prisma.book.findMany({
        where,
        include: {
          author: true,
        },
        orderBy: {
          [sortBy]: order,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.book.count({ where }),
    ]);

    // 4. Calcular paginación
    const totalPages = Math.ceil(total / limit);

    // 5. Responder
    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1 && totalPages > 0,
      },
    });

  } catch (error) {
    console.error("Error en búsqueda de libros:", error);

    return NextResponse.json(
      { error: "Error al buscar libros" },
      { status: 500 }
    );
  }
}

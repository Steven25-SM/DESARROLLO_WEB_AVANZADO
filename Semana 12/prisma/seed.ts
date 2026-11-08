
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const authorsData = [
    {
      name: "Gabriel García Márquez",
      email: "gabo@example.com",
      nationality: "Colombia",
      birthYear: 1927,
      bio: "Premio Nobel de Literatura 1982",
    },
    {
      name: "Isabel Allende",
      email: "isabel@example.com",
      nationality: "Chile",
      birthYear: 1942,
      bio: "Escritora chilena de novelas y relatos",
    },
    {
      name: "Julio Verne",
      email: "julio@example.com",
      nationality: "Francia",
      birthYear: 1828,
      bio: "Pionero de la literatura de ciencia ficción",
    },
  ];

  const authors = [];

  for (const data of authorsData) {
    const author = await prisma.author.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });

    authors.push(author);
  }

  const books = [
    // Gabriel García Márquez
    {
      title: "Cien años de soledad",
      description: "Obra maestra del realismo mágico",
      isbn: "978-0307474728",
      publishedYear: 1967,
      genre: "Novela",
      pages: 417,
      authorId: authors[0].id,
    },
    {
      title: "El amor en los tiempos del cólera",
      description: "Una historia de amor que atraviesa décadas",
      isbn: "978-0307389732",
      publishedYear: 1985,
      genre: "Romance",
      pages: 368,
      authorId: authors[0].id,
    },
    {
      title: "Crónica de una muerte anunciada",
      description: "Relato sobre un asesinato anunciado",
      isbn: "978-1400034710",
      publishedYear: 1981,
      genre: "Misterio",
      pages: 122,
      authorId: authors[0].id,
    },
    {
      title: "El otoño del patriarca",
      description: "Novela sobre el poder y la dictadura",
      isbn: "978-0060882869",
      publishedYear: 1975,
      genre: "Novela",
      pages: 255,
      authorId: authors[0].id,
    },
    {
      title: "La hojarasca",
      description: "Historia ambientada en Macondo",
      isbn: "978-0060883287",
      publishedYear: 1955,
      genre: "Realismo mágico",
      pages: 107,
      authorId: authors[0].id,
    },

    // Isabel Allende
    {
      title: "La casa de los espíritus",
      description: "Saga familiar con elementos fantásticos",
      isbn: "978-1501117015",
      publishedYear: 1982,
      genre: "Realismo mágico",
      pages: 481,
      authorId: authors[1].id,
    },
    {
      title: "Paula",
      description: "Relato autobiográfico y familiar",
      isbn: "978-0061552051",
      publishedYear: 1994,
      genre: "Autobiografía",
      pages: 330,
      authorId: authors[1].id,
    },
    {
      title: "Eva Luna",
      description: "Historias de una narradora extraordinaria",
      isbn: "978-1501117121",
      publishedYear: 1987,
      genre: "Novela",
      pages: 320,
      authorId: authors[1].id,
    },
    {
      title: "Hija de la fortuna",
      description: "Aventura y búsqueda personal en el siglo XIX",
      isbn: "978-0061120250",
      publishedYear: 1999,
      genre: "Aventura",
      pages: 399,
      authorId: authors[1].id,
    },
    {
      title: "El juego de Ripper",
      description: "Una investigación criminal llena de misterio",
      isbn: "978-0307950447",
      publishedYear: 2014,
      genre: "Misterio",
      pages: 480,
      authorId: authors[1].id,
    },

    // Julio Verne
    {
      title: "Viaje al centro de la Tierra",
      description: "Expedición científica al interior del planeta",
      isbn: "978-0486411105",
      publishedYear: 1864,
      genre: "Ciencia ficción",
      pages: 240,
      authorId: authors[2].id,
    },
    {
      title: "Veinte mil leguas de viaje submarino",
      description: "Aventura a bordo del submarino Nautilus",
      isbn: "978-0451531687",
      publishedYear: 1870,
      genre: "Aventura",
      pages: 400,
      authorId: authors[2].id,
    },
    {
      title: "La vuelta al mundo en 80 días",
      description: "Un viaje alrededor del mundo contra el tiempo",
      isbn: "978-0451530767",
      publishedYear: 1873,
      genre: "Aventura",
      pages: 240,
      authorId: authors[2].id,
    },
    {
      title: "De la Tierra a la Luna",
      description: "Un proyecto para viajar al espacio",
      isbn: "978-0486250885",
      publishedYear: 1865,
      genre: "Ciencia ficción",
      pages: 192,
      authorId: authors[2].id,
    },
    {
      title: "La isla misteriosa",
      description: "Supervivencia y descubrimientos en una isla",
      isbn: "978-0486400931",
      publishedYear: 1874,
      genre: "Aventura",
      pages: 480,
      authorId: authors[2].id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: book,
      create: book,
    });
  }

  console.log("¡Datos cargados correctamente!");
  console.log(`Autores: ${authors.length}`);
  console.log(`Libros: ${books.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

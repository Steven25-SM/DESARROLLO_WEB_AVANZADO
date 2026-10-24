
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #171125, #581c87)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "40px 24px",
          textAlign: "center",
          color: "#222222",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: "65px", marginBottom: "12px" }}>
          🔎
        </div>

        <h1
          style={{
            fontSize: "76px",
            fontWeight: "bold",
            color: "#7e22ce",
            margin: "0",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            margin: "12px 0",
          }}
        >
          ¡Pokémon no encontrado!
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#666666",
            lineHeight: "1.6",
            marginBottom: "28px",
          }}
        >
          Parece que este Pokémon se ha escapado.
          La página que buscas no existe.
          ¡Regresa a la Pokédex para seguir explorando!
        </p>

        <Link
          href="/pokemon"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            backgroundColor: "#7e22ce",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Volver a la Pokédex
        </Link>
      </div>
    </main>
  );
}

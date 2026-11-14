const stars = Array.from({ length: 70 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 29 + 7) % 65}%`,
  size: 1 + (i % 3),
  delay: `${(i % 9) * 0.5}s`,
}));

export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#0b0420] via-[#2b0f4f] to-[#7a1d63]"
    >
      {/* Blobs de color */}
      <div className="animate-float absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/40 blur-3xl" />
      <div
        className="animate-float absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/30 blur-3xl"
        style={{ animationDuration: "18s", animationDelay: "-4s" }}
      />
      <div
        className="animate-float absolute bottom-10 left-1/3 h-[22rem] w-[22rem] rounded-full bg-orange-500/25 blur-3xl"
        style={{ animationDuration: "22s", animationDelay: "-8s" }}
      />

      {/* Estrellas */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Luna y estrella fugaz */}
      <div className="moon absolute top-24 left-[8%]" />
      <div className="animate-shoot shooting-star absolute top-28 right-[12%]" />

      {/* Montañas */}
      <svg
        className="absolute bottom-0 left-0 h-[38vh] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c026d3" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3b0b5c" />
          </linearGradient>
          <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6d28d9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#12062b" />
          </linearGradient>
        </defs>
        <path
          d="M0 250 C 180 170, 320 130, 500 200 S 820 100, 1020 190 S 1320 230, 1440 160 V400 H0Z"
          fill="url(#m1)"
        />
        <path
          d="M0 320 C 200 250, 360 230, 560 290 S 900 220, 1100 285 S 1350 300, 1440 260 V400 H0Z"
          fill="url(#m2)"
        />
      </svg>
    </div>
  );
}
import { useEffect, useRef, useState, useCallback } from "react";
import { ShieldCheck, ExternalLink, BadgeCheck, Sparkles } from "lucide-react";

// ─── Particle System ───────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  alpha: number;
  color: string;
}

function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    // Paleta: negro, grises oscuros y gris-blanco
    const COLORS = [
      "#ffffff",
      "#d1d5db",
      "#9ca3af",
      "#6b7280",
      "#4b5563",
      "#e5e7eb",
    ];
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        dx: (Math.random() - 0.5) * 0.12,
        dy: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.6 + 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo: negro puro a gris muy oscuro
      const bg = ctx.createLinearGradient(0, 0, canvas.width * 0.6, canvas.height);
      bg.addColorStop(0, "#000000");
      bg.addColorStop(0.5, "#0d0d0d");
      bg.addColorStop(1, "#111111");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula blobs en tonos grises
      const nebulaBlobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.2,  r: 280, c: "rgba(100,100,110,0.055)" },
        { x: canvas.width * 0.82, y: canvas.height * 0.6,  r: 220, c: "rgba(80,80,90,0.045)"   },
        { x: canvas.width * 0.5,  y: canvas.height * 0.85, r: 190, c: "rgba(60,60,70,0.04)"    },
      ];
      nebulaBlobs.forEach((b) => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Partículas
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── Shooting Stars ────────────────────────────────────────────────────────────
function ShootingStar({ delay, top, left, duration }: { delay: number; top: string; left: string; duration: number }) {
  return (
    <div
      style={{
        position: "fixed",
        top,
        left,
        width: "2px",
        height: "2px",
        borderRadius: "50%",
        background: "white",
        opacity: 0,
        animation: `shoot ${duration}s linear ${delay}s infinite`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// ─── Rose decorations ──────────────────────────────────────────────────────────
const ROSE_URL =
  "https://media.discordapp.net/attachments/1502878615841406986/1508989850232160357/rose.png?ex=6a178bcf&is=6a163a4f&hm=d257c10940845ca80f4ecdd1d09336db3a34440bbd5b96c196433aa62ac88b31&=&format=webp&quality=lossless&width=341&height=300";

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
function TiltCard({ avatar, username }: { avatar: string | null; username: string | null }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const MAX_TILT = 8; // reducido para efecto suave

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rx = (-dy / (rect.height / 2)) * MAX_TILT;
    const ry = (dx / (rect.width / 2)) * MAX_TILT;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ rx, ry });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    cancelAnimationFrame(rafRef.current);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const DISCORD_SERVER =
    "https://discord.com/channels/1501782798124449924/1501782953821339688";

  return (
    <div
      ref={cardRef}
      style={{
        perspective: "1200px",
        width: "min(92vw, 400px)",
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card */}
      <div
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered
            ? "transform 0.12s ease-out"
            : "transform 0.6s cubic-bezier(.03,.98,.52,.99)",
          transformStyle: "preserve-3d",
          willChange: "transform",
          borderRadius: "22px",
          background: "rgba(255,255,255,0.055)",
          backdropFilter: "blur(30px) saturate(160%)",
          WebkitBackdropFilter: "blur(30px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: isHovered
            ? "0 28px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.14)"
            : "0 18px 55px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.09)",
          padding: "44px 38px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top shimmer — solo una línea decorativa, sin glow que siga al cursor */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
            borderRadius: "999px",
            pointerEvents: "none",
          }}
        />

        {/* Rosas decorativas en esquinas */}
        <img
          src={ROSE_URL}
          alt=""
          style={{
            position: "absolute",
            top: "-18px",
            left: "-22px",
            width: "120px",
            opacity: 0.18,
            transform: "rotate(-20deg)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <img
          src={ROSE_URL}
          alt=""
          style={{
            position: "absolute",
            bottom: "-18px",
            right: "-22px",
            width: "120px",
            opacity: 0.18,
            transform: "rotate(160deg)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Contenido */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Badge top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "26px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "999px",
              padding: "6px 16px 6px 11px",
            }}
          >
            <ShieldCheck size={17} color="#d1d5db" strokeWidth={2} />
            <span
              style={{
                color: "#d1d5db",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Discord OAuth2
            </span>
          </div>

          {/* Avatar */}
          <div style={{ position: "relative", marginBottom: "20px" }}>
            {/* Ring giratorio */}
            <div
              style={{
                position: "absolute",
                inset: "-5px",
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #ffffff22, #ffffffaa, #ffffff22)",
                animation: "spin 5s linear infinite",
                filter: "blur(0.5px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "50%",
                background: "#080808",
              }}
            />
            {avatar ? (
              <img
                src={avatar}
                alt={username ?? "User"}
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 1,
                  display: "block",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://cdn.discordapp.com/embed/avatars/0.png";
                }}
              />
            ) : (
              <div
                style={{
                  width: "108px",
                  height: "108px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <BadgeCheck size={42} color="#9ca3af" strokeWidth={1.5} />
              </div>
            )}
            {/* Online dot */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                width: "19px",
                height: "19px",
                borderRadius: "50%",
                background: "#22c55e",
                border: "3px solid #080808",
                zIndex: 2,
              }}
            />
          </div>

          {/* Username */}
          {username && (
            <p
              style={{
                color: "rgba(209,213,219,0.7)",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "6px",
                letterSpacing: "0.03em",
              }}
            >
              @{username}
            </p>
          )}

          {/* Check icon + título */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <BadgeCheck size={24} color="#e5e7eb" strokeWidth={2} />
            <h1
              style={{
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Autorización Completada
            </h1>
          </div>

          {/* Subtítulo */}
          <p
            style={{
              color: "rgba(156,163,175,0.75)",
              fontSize: "13px",
              textAlign: "center",
              marginBottom: "30px",
              lineHeight: 1.6,
              maxWidth: "270px",
            }}
          >
            Tu cuenta de Discord ha sido verificada exitosamente. Ya puedes acceder al servidor.
          </p>

          {/* Rosa central decorativa */}
          <img
            src={ROSE_URL}
            alt="Rosa"
            style={{
              width: "64px",
              opacity: 0.35,
              marginBottom: "24px",
              filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.12))",
            }}
          />

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              marginBottom: "26px",
            }}
          />

          {/* Botón */}
          <a
            href={DISCORD_SERVER}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              width: "100%",
              padding: "13px 22px",
              borderRadius: "13px",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
              color: "#e5e7eb",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow:
                "0 6px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "all 0.22s ease",
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-2px)";
              el.style.background = "linear-gradient(135deg, #222 0%, #333 100%)";
              el.style.boxShadow =
                "0 12px 36px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.14)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(0)";
              el.style.background = "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)";
              el.style.boxShadow =
                "0 6px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)";
            }}
          >
            <ExternalLink size={17} strokeWidth={2} />
            Ir al Servidor de Discord
          </a>

          {/* Sparkle row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "18px",
              opacity: 0.35,
            }}
          >
            <Sparkles size={12} color="#9ca3af" />
            <span style={{ color: "#9ca3af", fontSize: "11px", letterSpacing: "0.06em" }}>
              SECURE · VERIFIED · OAUTH2
            </span>
            <Sparkles size={12} color="#9ca3af" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const avatarParam = params.get("avatar");
    const usernameParam = params.get("username");
    const userIdParam = params.get("user_id") ?? params.get("id");
    const avatarHashParam = params.get("avatar_hash");

    if (avatarParam) {
      setAvatar(decodeURIComponent(avatarParam));
    } else if (userIdParam && avatarHashParam) {
      const ext = avatarHashParam.startsWith("a_") ? "gif" : "png";
      setAvatar(
        `https://cdn.discordapp.com/avatars/${userIdParam}/${avatarHashParam}.${ext}?size=256`
      );
    }
    if (usernameParam) setUsername(decodeURIComponent(usernameParam));
  }, []);

  const stars = [
    { delay: 0,   top: "12%", left: "8%",  duration: 6 },
    { delay: 2.5, top: "38%", left: "4%",  duration: 8 },
    { delay: 4,   top: "62%", left: "18%", duration: 5 },
    { delay: 1,   top: "7%",  left: "52%", duration: 7 },
    { delay: 3.5, top: "48%", left: "72%", duration: 9 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; overflow: hidden; background: #000; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes shoot {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          5%   { opacity: 0.9; }
          95%  { opacity: 0.6; }
          100% { transform: translateX(600px) translateY(260px); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-float   { animation: float 7s ease-in-out infinite; }
        .page-enter   { animation: fadeInUp 0.85s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <SpaceCanvas />

      {stars.map((s, i) => (
        <ShootingStar key={i} {...s} />
      ))}

      {/* Rosas de fondo grandes en esquinas de la pantalla */}
      <img
        src={ROSE_URL}
        alt=""
        style={{
          position: "fixed",
          top: "-40px",
          right: "-40px",
          width: "220px",
          opacity: 0.07,
          transform: "rotate(15deg)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <img
        src={ROSE_URL}
        alt=""
        style={{
          position: "fixed",
          bottom: "-40px",
          left: "-40px",
          width: "220px",
          opacity: 0.07,
          transform: "rotate(200deg)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div className="card-float page-enter">
          <TiltCard avatar={avatar} username={username} />
        </div>

        <p
          style={{
            position: "fixed",
            bottom: "16px",
            color: "rgba(107,114,128,0.4)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          DISCORD AUTHORIZATION · SECURE OAUTH2
        </p>
      </div>
    </>
  );
}

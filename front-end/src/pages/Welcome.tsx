import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div style={bg}>
      <div style={noiseOverlay} aria-hidden="true" />
      <div style={wrap}>
        <h1 style={title}>Match Me!</h1>
        <p style={tagline}>People, but actually your type.</p>

        <div style={btnStack}>
          <Link to="/register" style={btn} data-welcome-btn>
            Register
          </Link>
          <Link to="/login" style={btn} data-welcome-btn>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

const bg: React.CSSProperties = {
  minHeight: "100svh",
  height: "100svh",
  width: "100vw",
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
  padding: 0,
  background:
    "linear-gradient(90deg, rgba(255, 243, 163, 1) 0%, rgba(255, 180, 224, 1) 100%)",
};

const noiseOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.12,
  backgroundImage:
    "radial-gradient(rgba(0,0,0,0.18) 1px, transparent 1px)",
  backgroundSize: "10px 10px",
};

const wrap: React.CSSProperties = {
  width: "min(520px, 92vw)",
  textAlign: "center",
  display: "grid",
  gap: 18,
  alignItems: "center",
  justifyItems: "center",
  padding: "clamp(18px, 4vw, 40px) clamp(16px, 4vw, 28px)",
  borderRadius: 28,
  background: "rgba(255,255,255,0.28)",
  border: "1px solid rgba(255,255,255,0.45)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
  backdropFilter: "blur(10px)",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(44px, 6vw, 72px)",
  fontWeight: 900,
  letterSpacing: -1,
  color: "rgba(0,0,0,0.88)",
  textShadow: "0 2px 0 rgba(255,255,255,0.55)",
};

const tagline: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(18px, 2.2vw, 28px)",
  fontWeight: 800,
  color: "rgba(0,0,0,0.78)",
};

const btnStack: React.CSSProperties = {
  marginTop: 16,
  width: "100%",
  display: "grid",
  gap: 18,
  justifyItems: "center",
};

const btn: React.CSSProperties = {
  width: "min(340px, 88vw)",
  padding: "16px 18px",
  borderRadius: 999,
  textDecoration: "none",
  textAlign: "center",
  fontSize: "clamp(18px, 2.6vw, 22px)",
  fontWeight: 900,
  letterSpacing: 0.2,
  color: "rgba(0,0,0,0.85)",
  background: "rgba(186, 140, 255, 0.45)",
  border: "1px solid rgba(0,0,0,0.10)",
  boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
  transition: "transform 120ms ease, filter 120ms ease",
};


// quick hover without CSS files
(document as any).__welcomeHoverOnce ??= (() => {
  (document as any).__welcomeHoverOnce = true;
  const style = document.createElement("style");
  style.textContent = `
    a[data-welcome-btn]:hover { transform: translateY(-2px); filter: brightness(1.03); }
    a[data-welcome-btn]:active { transform: translateY(1px); }
  `;
  document.head.appendChild(style);
})();

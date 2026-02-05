import { Link } from "react-router-dom";

export default function Questions() {
  return (
    <div style={bg}>
      <div style={noiseOverlay} aria-hidden="true" />

      <div style={wrap}>
        <h1 style={title}>Tell us about you</h1>

        <p style={subtitle}>
          This helps us recommend people you’ll actually like.
        </p>

        <div style={form}>
          <input style={input} placeholder="Name" />
          <input style={input} placeholder="Age" />
          <input style={input} placeholder="City" />
          <input style={input} placeholder="Hobbies" />
          <input style={input} placeholder="Looking for (friends / dating)" />
        </div>

        <Link to="/" style={btn}>
          Save & continue
        </Link>
      </div>
    </div>
  );
}

const bg: React.CSSProperties = {
  minHeight: "100svh",
  width: "100vw",
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(90deg, rgba(255,243,163,1) 0%, rgba(255,180,224,1) 100%)",
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
  width: "min(560px, 92vw)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 22,
  padding: "clamp(24px, 5vw, 42px)",
  borderRadius: 28,
  background: "rgba(255,255,255,0.30)",
  border: "1px solid rgba(255,255,255,0.45)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
  backdropFilter: "blur(10px)",
  textAlign: "center",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(36px, 5vw, 60px)",
  fontWeight: 900,
};

const subtitle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  opacity: 0.75,
};

const form: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  marginTop: 8,
};

const input: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  height: 60,
  padding: "0 22px",
  borderRadius: 18,
  border: "1px solid rgba(0,0,0,0.35)",
  background: "rgba(220,220,220,0.9)",
  fontSize: 18,
  fontWeight: 700,
  textAlign: "center",
  outline: "none",
  boxShadow:
    "6px 6px 0 rgba(0,0,0,0.25), 0 12px 26px rgba(0,0,0,0.12)",
};

const btn: React.CSSProperties = {
  width: "min(340px, 90%)",
  padding: "16px",
  borderRadius: 999,
  fontSize: 22,
  fontWeight: 900,
  textAlign: "center",
  textDecoration: "none",
  color: "rgba(0,0,0,0.85)",
  background: "rgba(186,140,255,0.6)",
  boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
  marginTop: 6,
};
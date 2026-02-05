import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div style={bg}>
      <div style={noiseOverlay} aria-hidden="true" />

      <div style={wrap}>
        <h1 style={title}>Log In</h1>

        <div style={form}>
          <input style={input} placeholder="Email" />
          <input style={input} placeholder="Password" type="password" />
        </div>

        <Link to="/questions" style={btn} data-welcome-btn>
          Next
        </Link>

        <div style={linksRow}>
          <Link to="/recovery" style={smallLink}>
            Forgot password?
          </Link>
        </div>

        <div style={foot}>
          <span style={footText}>No account yet?</span>
          <Link to="/register" style={footLink}>
            Register
          </Link>
        </div>
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
  width: "min(520px, 92vw)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 26,
  padding: "clamp(24px, 5vw, 42px)",
  borderRadius: 28,
  background: "rgba(255,255,255,0.30)",
  border: "1px solid rgba(255,255,255,0.45)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
  backdropFilter: "blur(10px)",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(42px, 6vw, 68px)",
  fontWeight: 900,
  letterSpacing: -1,
};

const form: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 18,
};

const input: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  height: 64,
  padding: "0 22px",
  borderRadius: 18,
  border: "1px solid rgba(0,0,0,0.35)",
  background: "rgba(220,220,220,0.9)",
  fontSize: 20,
  fontWeight: 700,
  textAlign: "center",
  outline: "none",
  boxShadow:
    "6px 6px 0 rgba(0,0,0,0.25), 0 14px 30px rgba(0,0,0,0.12)",
};

const btn: React.CSSProperties = {
  width: "min(320px, 90%)",
  padding: "16px",
  borderRadius: 999,
  fontSize: 24,
  fontWeight: 900,
  textAlign: "center",
  textDecoration: "none",
  color: "rgba(0,0,0,0.85)",
  background: "rgba(186,140,255,0.6)",
  boxShadow: "0 14px 35px rgba(0,0,0,0.14)",
};

const linksRow: React.CSSProperties = {
  marginTop: -10,
};

const smallLink: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "rgba(0,0,0,0.75)",
  textDecoration: "underline",
};

const foot: React.CSSProperties = {
  marginTop: 4,
  display: "flex",
  gap: 6,
  fontSize: 14,
};

const footText: React.CSSProperties = {
  opacity: 0.75,
};

const footLink: React.CSSProperties = {
  fontWeight: 800,
  textDecoration: "underline",
};
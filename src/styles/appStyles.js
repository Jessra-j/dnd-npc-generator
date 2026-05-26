export const rootStyle = (classColor) => ({
  minHeight: "100vh",
  background: `
    radial-gradient(
      circle at top,
      ${classColor}33 0%,
      #3b2052 20%,
      #1d1228 55%,
      #0d0912 100%
    )
  `,
  transition: "background 0.6s ease",
  color: "#f7f1e3",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "28px 16px",
});

export const contentWrapperStyle = {
  width: "100%",
  padding: "0 24px",
  boxSizing: "border-box",
};

export const pdfRootStyle = (classColor) => ({
  maxWidth: "1600px",
  width: "100%",
  margin: "0 auto",
  background: `
      radial-gradient(
        circle at top,
        ${classColor}33 0%,
        #3b2052 20%,
        #1d1228 55%,
        #0d0912 100%
      )
    `,
});

export const headerRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 20,
  justifyContent: "center",
  marginBottom: 12,
  flexWrap: "wrap",
};

export const logoBaseStyle = {
  objectFit: "contain",
  display: "block",
};

export const heroTitleStyle = {
  textAlign: "center",
  color: "#e9c46a",
  fontSize: "2.8rem",
  marginTop: 0,
  marginBottom: "8px",
  lineHeight: 1.1,
  fontWeight: "bold",
  letterSpacing: "1px",
  textShadow: "0 0 6px rgba(255,209,102,0.6), 0 0 12px rgba(255,209,102,0.4)",
  fontFamily: "'Cinzel', 'Georgia', serif",
};

export const heroSubtitleStyle = {
  textAlign: "center",
  color: "#e9d8a6",
  marginTop: 0,
  marginBottom: "20px",
  fontSize: "1rem",
  lineHeight: 1.6,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

export const optionsCardStyle = (isExporting) => ({
  background: isExporting ? "#34234a" : "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  padding: "26px 24px 28px 24px",
  marginBottom: 28,
  boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
});

export const optionsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

export const scalingBoxStyle = (classColor) => ({
  gridColumn: "1 / -1",
  background: `${classColor}22`,
  border: `1px solid ${classColor}55`,
  padding: "6px 10px",
  borderRadius: "10px",
  marginTop: 10,
});

export const scalingLabelStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: "0.85rem",
  color: "#dbcdb0",
  cursor: "pointer",
};

export const progressContainerStyle = {
  height: "8px",
  width: "100%",
  background: "rgba(255,255,255,0.12)",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: 18,
};

export const progressBarStyle = {
  height: "100%",
  width: "40%",
  background: "linear-gradient(135deg, #c4b5fd, #e9c46a)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "999px",
  animation: "loading 1.1s linear infinite",
};

export const generateButtonStyle = (loadingNpc) => ({
  padding: "14px 22px",
  borderRadius: 14,
  border: "none",
  background: loadingNpc
    ? "#8f8f8f"
    : "linear-gradient(135deg, #c4b5fd, #ffd166)",
  color: "#1a1223",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: loadingNpc ? "not-allowed" : "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25), 0 0 12px rgba(196,181,253,0.5)",
  transition: "all 0.2s ease",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
});

export const characterSheetCardStyle = (classColor) => ({
  position: "relative",
  overflow: "hidden",
  background: `
      radial-gradient(
        circle at top,
        ${classColor}33 0%,
        #3b2052 20%,
        #1d1228 55%,
        #0d0912 100%
      )
    `,
  border: "1px solid rgba(255,214,102,0.35)",
  borderRadius: 22,
  padding: 26,
  boxShadow: "0 20px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,214,102,0.05)",
  backdropFilter: "blur(8px)",
});

export const watermarkStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  opacity: 0.06,
  filter: "blur(2px)",
  pointerEvents: "none",
};

export const glowStyle = {
  position: "absolute",
  right: "-80px",
  bottom: "-50px",
  width: 420,
  height: 420,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(255,209,102,0.15), rgba(192,132,252,0.08), transparent 70%)",
  filter: "blur(40px)",
  pointerEvents: "none",
};

export const characterSheetBodyStyle = (classColor, isExporting) => ({
  position: "relative",
  display: "grid",
  flexDirection: "column",
  gridTemplateColumns: "minmax(300px, 380px) 1fr",
  gap: 30,
  padding: "32px",
  borderRadius: "30px",
  background: isExporting
    ? "#3b2052"
    : `
        radial-gradient(
          circle at 50% 120%,
          ${classColor}33,
          transparent
        ),
        linear-gradient(
          145deg,
          rgba(75,45,100,0.85),
          rgba(25,15,40,0.95)
        )
      `,
});

export const leftColumnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  paddingRight: "16px",
  borderRight: "1px solid rgba(255,255,255,0.08)",
};

export const portraitCardStyle = (classColor) => ({
  width: 220,
  height: 220,
  margin: "0 auto 16px",
  borderRadius: 18,
  position: "relative",
  overflow: "hidden",
  background: "radial-gradient(circle at 30% 30%, #ffd166, #8d5a11)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "3rem",
  fontWeight: "bold",
  color: "#2a1b0b",
  boxShadow: `
    0 10px 24px rgba(0,0,0,0.35),
    0 0 12px ${classColor}88,
    0 0 30px ${classColor}44
  `,
  fontFamily: "'Cinzel', 'Georgia', serif",
});

export const nameStyle = (classColor) => ({
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  letterSpacing: "1px",
  color: classColor,
  textShadow: `0 0 8px ${classColor}99`,
});

export const subclassBadgeStyle = (classColor) => ({
  padding: "6px 14px",
  borderRadius: 999,
  background: `${classColor}22`,
  border: `1px solid ${classColor}66`,
  color: classColor,
  fontSize: "0.8rem",
  fontWeight: "bold",
  boxShadow: `0 0 12px ${classColor}88`,
  letterSpacing: "0.06em",
});

export const skillBadgeStyle = (classColor, proficient) => ({
  padding: "6px 10px",
  borderRadius: 8,
  background: proficient ? `${classColor}22` : "rgba(0,0,0,0.25)",
  border: proficient ? `1px solid ${classColor}55` : "1px solid rgba(255,255,255,0.05)",
  fontSize: "0.85rem",
  fontWeight: proficient ? "bold" : "normal",
});

export const downloadButtonStyle = (classColor) => ({
  padding: "12px 18px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "#ffd166",
  color: "#2a1b0b",
  fontWeight: "bold",
  boxShadow: `0 0 12px ${classColor}`,
});

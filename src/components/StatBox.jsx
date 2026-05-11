export default function StatBox({ label, value, savingThrow }) {
  const modifier = Math.floor((value - 10) / 2);
  const displayModifier = modifier >= 0 ? `+${modifier}` : modifier;

  return (
    <div className="stat-container">
      <div className="stat-label">{label}</div>

      <div className="stat-circle">
        <div className="stat-value">{value}</div>
        <div className="stat-modifier">{displayModifier}</div>
      </div>

      <style>{`
        .stat-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s ease;
        }

        .stat-container:hover {
          transform: translateY(-4px) scale(1.05);
        }

        .stat-label {
          font-size: 0.8rem;
          margin-bottom: 6px;
          opacity: 0.8;
          letter-spacing: 0.05em;
        }

        .stat-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffd166, #6a3ea1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border: 2px solid rgba(255,255,255,0.2);

          box-shadow:
            0 0 10px rgba(255, 209, 102, 0.5),
            inset 0 0 10px rgba(0,0,0,0.4);

          transition: all 0.25s ease;
        }

        .stat-container:hover .stat-circle {
          box-shadow:
            0 0 20px rgba(255, 209, 102, 0.9),
            0 0 40px rgba(192, 132, 252, 0.4),
            inset 0 0 12px rgba(0,0,0,0.5);

          transform: scale(1.08);
          animation: pulseGlow 1.5s infinite alternate;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .stat-modifier {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        @keyframes pulseGlow {
          from {
            box-shadow:
              0 0 15px rgba(255, 209, 102, 0.6),
              0 0 25px rgba(192, 132, 252, 0.3),
              inset 0 0 10px rgba(0,0,0,0.4);
          }
          to {
            box-shadow:
              0 0 30px rgba(255, 209, 102, 1),
              0 0 60px rgba(192, 132, 252, 0.7),
              inset 0 0 14px rgba(0,0,0,0.5);
          }
        }
      `}</style>
    </div>
  );
}

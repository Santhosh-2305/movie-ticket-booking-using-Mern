// Reusable glassmorphism auth card wrapper
export default function AuthCard({ children }) {
  return (
    // Full-screen gradient background
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0828 40%, #0a1428 100%)",
      }}
    >
      {/* Decorative blurred orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: "10%", left: "15%",
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed", bottom: "15%", right: "10%",
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
        }}
      />

      {/* Glass card */}
      <div
        className="glass-card animate-slide-up w-full rounded-2xl p-8 shadow-2xl"
        style={{ maxWidth: 440 }}
      >
        {children}
      </div>
    </div>
  );
}

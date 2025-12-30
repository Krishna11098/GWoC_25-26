export default function AboutStorySection({ children, accent = false }) {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background grain / glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(82, 99, 85, 0.12), transparent 42%), radial-gradient(circle at 80% 30%, rgba(245, 207, 194, 0.18), transparent 40%)",
        }}
      />

      {accent && (
        <div
          className="absolute right-0 top-1/3 w-72 h-72 blur-3xl rounded-full"
          style={{ backgroundColor: "rgba(247, 213, 124, 0.16)" }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

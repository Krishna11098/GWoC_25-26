export default function AboutStorySection({ children, accent = false }) {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background grain / glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,foreground-2,transparent_40%)]" />
      
      {accent && (
        <div className="absolute right-0 top-1/3 w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full" />
      )}

      <div className="relative z-10">{children}</div>
    </section>
  );
}

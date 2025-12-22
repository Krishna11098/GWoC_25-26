export default function Subheading({
  text = "JoyJuncture creates playful, immersive game experiences for events, workshops, and communities — online and offline",
}) {
  return (
    <section className="w-full px-8 py-24 md:px-16 md:py-24 lg:py-32 bg-(--color-background-2)">
      <div className="ml-0 lg:ml-16 max-w-4xl text-left">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-relaxed tracking-tight text-gray-900">
          JoyJuncture creates playful, immersive game experiences for events,
          workshops, and communities — online and offline
        </h2>
      </div>
    </section>
  );
}

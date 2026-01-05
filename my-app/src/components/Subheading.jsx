import ScrollFloat from "./ScrollFloat";

export default function Subheading({
  text = "JoyJuncture creates playful, immersive game experiences for events, workshops, and communities — online and offline",
}) {
  return (
    <section className="w-full px-8 py-24 md:px-16 md:py-24 lg:py-32">
      <div className="ml-0 lg:ml-16 max-w-4xl text-left">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-relaxed tracking-tight">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=20%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            JoyJuncture creates playful, immersive game experiences for events,
            workshops, and communities — online and offline
          </ScrollFloat>
        </h2>
      </div>
    </section>
  );
}

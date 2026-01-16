export default function SoftWaveBackground({
  className = "",
  height = "100%",
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="w-[120%]"
        style={{ height }}
      >
        {/* <path
          d="M0,350 Q180,150 360,350 Q540,550 720,350 Q900,150 1080,350 Q1260,550 1440,350 L1440,0 L0,0 Z"
          className="animate-waveSlow fill-light-blue opacity-80"
        /> */}
        <path
          d="M0,380 Q120,280 240,380 Q360,480 480,380 Q600,280 720,380 Q840,480 960,380 Q1080,280 1200,380 Q1320,480 1440,380 L1440,0 L0,0 Z"
          className="animate-waveMedium fill-light-blue opacity-90"
        />
        {/* <path
          d="M0,400 Q200,550 400,400 Q600,150 800,400 Q1000,550 1200,400 Q1400,150 1440,400 L1440,0 L0,0 Z"
          className="animate-waveFast fill-light-blue opacity-60"
        /> */}
      </svg>
    </div>
  );
}

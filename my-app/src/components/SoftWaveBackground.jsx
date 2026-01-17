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
        <path
          d="M0,450 Q180,380 360,450 Q540,520 720,450 Q900,380 1080,450 Q1260,520 1440,450 L1440,0 L0,0 Z"
          className="animate-waveSlow fill-light-blue opacity-30"
        />
        <path
          d="M0,480 Q120,430 240,480 Q360,530 480,480 Q600,430 720,480 Q840,530 960,480 Q1080,430 1200,480 Q1320,530 1440,480 L1440,0 L0,0 Z"
          className="animate-waveMedium fill-light-blue opacity-20"
        />
        {/* <path
          d="M0,400 Q200,550 400,400 Q600,150 800,400 Q1000,550 1200,400 Q1400,150 1440,400 L1440,0 L0,0 Z"
          className="animate-waveFast fill-light-blue opacity-60"
        /> */}
      </svg>
    </div>
  );
}

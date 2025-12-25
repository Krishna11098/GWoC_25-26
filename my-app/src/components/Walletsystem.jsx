"use client";

export default function GamificationTeaser() {
  return (
    <section className="relative bg-background-2 py-40 overflow-hidden text-font-2">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          {/* LEFT — TEXT */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="h-9 w-2 rounded-full bg-foreground" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                Gamification
              </p>
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold leading-tight">
              Every interaction <br />
              <span className="text-accent">earns you rewards</span>
            </h2>

            <p className="text-lg leading-relaxed">
              Attend events, participate in experiences, complete challenges,
              and watch your points turn into real rewards you can actually use.
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <span className="text-accent">●</span>
                Earn points for events, games, and workshops
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">●</span>
                Track everything in a single wallet
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent">●</span>
                Redeem points for rewards & experiences
              </li>
            </ul>
          </div>

          {/* RIGHT — VISUAL WALLET */}
          <div className="lg:col-span-7 relative flex justify-center">
            <div
              className="relative mx-auto max-w-md rounded-3xl
                bg-foreground text-font backdrop-blur-xl
                border border-white/80
                shadow-[0_40px_100px_rgba(255,255,255,0.12)]
                p-8 space-y-6
                animate-float"
            >
              {/* Wallet Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wider">Joy Wallet</p>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">
                  Active
                </span>
              </div>

              {/* Balance */}
              <div className="pt-2">
                <p className="text-sm">Total Points</p>
                <p className="text-5xl font-semibold text-background tracking-tight">
                  2,450
                </p>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4 pt-4">
                <WalletRow label="Event Attended" points="+250" />
                <WalletRow label="Game Night" points="+120" />
                <WalletRow label="Workshop Completed" points="+400" />
              </div>

              {/* Redeem Preview */}
              <div className="rounded-2xl bg-foreground p-5 border border-white/30 space-y-4">
                <p className="text-sm text-font">Redeem your points for:</p>
                <div className="flex flex-wrap gap-3">
                  <RewardChip label="Free Event Pass" />
                  <RewardChip label="Merchandise" />
                  <RewardChip label="Exclusive Access" />
                </div>
              </div>
            </div>

            {/* Floating Earned Points */}
            <div className="absolute -top-6 -right-6 rounded-xl bg-foreground-2 px-5 py-2 text-sm font-medium text-black shadow-xl animate-pulse-soft">
              +250 points earned
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function WalletRow({ label, points }) {
  return (
    <div
      className="flex items-center justify-between
        rounded-xl bg-white/5 px-5 py-3
        border border-white/10
        transition-transform duration-300
        hover:-translate-y-0.5 hover:bg-white/10"
    >
      <span className="text-sm ">{label}</span>
      <span className="text-sm font-medium text-accent">{points}</span>
    </div>
  );
}

function RewardChip({ label }) {
  return (
    <span className="rounded-full bg-background-2 text-font-2 px-4 py-1.5 text-xs border border-white/10 transition-all duration-300 hover:bg-accent-soft hover:text-accent">
      {label}
    </span>
  );
}

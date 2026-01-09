"use client";

export default function GamificationTeaser() {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden text-[var(--font)]">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
          {/* LEFT — TEXT */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 animate-fade-in">
            {/* <div className="flex items-center gap-3">
              <span className="h-9 w-2 rounded-full bg-[var(--orange)]" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                Gamification
              </p>
            </div> */}

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-tight">
              Every interaction <br />
              <span className="text-font">earns you rewards</span>
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-black">
              Attend events, participate in experiences, complete challenges,
              and watch your points turn into real rewards you can actually use.
            </p>
            <ul className="space-y-4 pt-2 text-black text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-font">●</span>
                Earn points for events, games, and workshops
              </li>
              <li className="flex items-start gap-3">
                <span className="text-font">●</span>
                Track everything in a single wallet
              </li>
              <li className="flex items-start gap-3">
                <span className="text-font">●</span>
                Redeem points for rewards & experiences
              </li>
            </ul>
          </div>

          {/* RIGHT — VISUAL WALLET */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-[var(--bg)] text-[var(--font)] backdrop-blur-xl border-2 border-[var(--green)] shadow-[0_30px_80px_rgba(0,0,0,0.12)] p-6 md:p-8 space-y-6 animate-float">
              {/* Wallet Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-base uppercase tracking-wider">
                  Joy Wallet
                </p>
                
              </div>

              {/* Balance */}
              <div className="pt-2">
                <p className="text-sm md:text-base">Total Points</p>
                <p className="text-5xl md:text-6xl font-semibold text-black tracking-tight">
                  2,450
                </p>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                <WalletRow label="Event Attended" points="+250" />
                <WalletRow label="Game Night" points="+120" />
                <WalletRow label="Workshop Completed" points="+400" />
              </div>

              {/* Redeem Preview */}
              <div className="rounded-2xl bg-[var(--green)]/20 p-4 md:p-5 border border-[var(--green)] space-y-4">
                <p className="text-sm md:text-base">Redeem your points for:</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <RewardChip label="Free Event Pass" />
                  <RewardChip label="Merchandise" />
                  <RewardChip label="Exclusive Access" />
                </div>
              </div>
            </div>

            {/* Floating Earned Points */}
            <div className="absolute -top-4 md:-top-6 -right-2 md:-right-6 rounded-xl bg-[var(--orange)] px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base font-medium text-[var(--font)] shadow-xl animate-pulse-soft">
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
    <div className="flex items-center justify-between rounded-xl bg-[var(--green)]/15 px-5 py-3 border border-[var(--green)]/40 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[var(--green)]/25">
      <span className="text-base ">{label}</span>
      <span className="text-base font-medium text-black/60">
        {points}
      </span>
    </div>
  );
}

function RewardChip({ label }) {
  return (
    <span className="rounded-full bg-[var(--bg)] px-4 py-1.5 text-sm border border-[var(--green)] transition-all duration-300 hover:bg-[var(--orange)]/25">
      {label}
    </span>
  );
}

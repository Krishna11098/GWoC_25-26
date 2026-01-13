export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Experiences", href: "/experiences" },
    { label: "Play", href: "/play" },
    { label: "Events", href: "/experiences/events" },
    { label: "Community", href: "/community" },
    { label: "Contact Us", href: "/contact" },
    { label: "Send a Query", href: "/query" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-font text-bg backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo3.png"
              alt="Joy Juncture logo"
              className="h-16 w-16 rounded-2xl object-contain shadow-lg ring-2 ring-orange/20"
            />
            <span className="text-2xl font-bold tracking-tight text-bg">JoyJuncture</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-gray-300">
            Crafted experiences, joyful connections, and premium play for
            communities everywhere.
          </p>
        </div>

        <div className="grid flex-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold">Navigate</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-300">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-all duration-200 hover:translate-x-1 hover:text-orange"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <a href="mailto:hello@joyjuncture.com" className="hover:text-orange">hello@joyjuncture.com</a>
              <a href="tel:+15551234567" className="hover:text-orange">+1 (555) 123-4567</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold">Follow</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <a
                href="#"
                className="transition-colors duration-200 hover:text-orange"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-orange"
              >
                Instagram
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-orange"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-xs text-gray-400 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} JoyJuncture. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-orange transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

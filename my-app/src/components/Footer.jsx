
export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Experiences", href: "/experiences" },
    { label: "Play", href: "/play" },
    { label: "Events", href: "/events" },
    { label: "Community", href: "/community" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-font text-bg backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:items-start md:justify-between md:py-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-sm font-semibold shadow-sm">
              JJ
            </span>
            <span className="text-lg font-semibold tracking-tight">
              JoyJuncture
            </span>
          </div>
          <p className="max-w-sm text-sm text-gray-300">
            Crafted experiences, joyful connections, and premium play for
            communities everywhere.
          </p>
        </div>

        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Navigate</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-300">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors duration-200 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <span>hello@joyjuncture.com</span>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Follow</h3>
            <div className="flex gap-3 text-sm text-gray-300">
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                Instagram
              </a>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-gray-900"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-4 text-xs text-gray-300 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} JoyJuncture. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

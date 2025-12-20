// app/layout.jsx - ROOT LAYOUT
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {" "}
          {/* ← AuthProvider wraps EVERYTHING */}
          {children} {/* ← This includes AdminLayout */}
        </AuthProvider>
      </body>
    </html>
  );
}

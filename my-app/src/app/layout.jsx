import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import MaintenanceGate from "@/components/MaintenanceGate";
import BanCheck from "@/components/BanCheck";
import ChatbotWidget from "@/components/ChatbotWidget";

export const metadata = {
  title: "JoyJuncture - Premium Experiences",
  description:
    "Crafted experiences, joyful connections, and premium play for communities everywhere.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-gray-900">
        <SettingsProvider>
          <MaintenanceGate>
            <BanCheck>
              {/* Your existing app content */}
              {children}
              <ChatbotWidget />
            </BanCheck>
          </MaintenanceGate>
        </SettingsProvider>
      </body>
    </html>
  );
}

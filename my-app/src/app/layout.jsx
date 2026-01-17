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
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Lemon&family=Lumanosimo&family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Caveat:wght@400..700&display=swap');
        </style>
        <style>
          {`
            .lemon-regular {
              font-family: "Lemon", serif;
              font-weight: 400;
              font-style: normal;
            }

            .lumanosimo-regular {
              font-family: "Lumanosimo", cursive;
              font-weight: 400;
              font-style: normal;
            }

            /* Variable style example with a unique class name */
            .dancing-script-headline {
              font-family: "Dancing Script", cursive;
              font-optical-sizing: auto;
              font-weight: 700;
              font-style: normal;
            }

            .fraunces-chunky {
              font-family: "Fraunces", serif;
              font-variation-settings: "SOFT" 100, "WONK" 1;
              font-weight: 900;
            }

            .caveat-script {
              font-family: "Caveat", cursive;
            }
          `}
        </style>
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

"use client";

import { useState } from "react";

const CHATBOT_ID = "6lXVbZQWFfGIKKQdlLO47";
const CHATBOT_DOMAIN = "www.chatbase.co";
const IFRAME_SRC = `https://${CHATBOT_DOMAIN}/chatbot-iframe/${CHATBOT_ID}`;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen ? (
        /* Floating ellipse launcher */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open JoyHelper chatbot"
          className="fixed right-6 bottom-6 z-40 shadow-lg transition-transform duration-150 ease-out hover:scale-105 focus:outline-none"
          style={{
            background: "linear-gradient(135deg, #111827, #1f2937)",
            color: "#f9fafb",
            borderRadius: "999px",
            padding: "12px 22px",
            fontWeight: 600,
            letterSpacing: "0.01em",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          Ask your queries!
        </button>
      ) : (
        /* Chat window with close button at bottom */
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
          <div
            className="flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white"
            style={{ width: "360px", height: "60vh", maxHeight: "520px" }}
          >
            <iframe
              title="JoyHelper Chatbot"
              src={IFRAME_SRC}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="clipboard-write; clipboard-read; microphone"
            />
          </div>
          
          {/* Close button at the bottom */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close JoyHelper chatbot"
            className="mt-2 shadow-lg transition-transform duration-150 ease-out hover:scale-105 focus:outline-none"
            style={{
              background: "linear-gradient(135deg, #111827, #1f2937)",
              color: "#f9fafb",
              borderRadius: "999px",
              padding: "12px 22px",
              fontWeight: 600,
              letterSpacing: "0.01em",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

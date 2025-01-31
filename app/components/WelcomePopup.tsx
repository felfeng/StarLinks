/* eslint-disable */

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("hasSeenWelcomePopup");
      if (!hasSeenPopup && !dismissed) {
        setShow(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("hasSeenWelcomePopup", "true");
  };

  if (!show) return null;

  return (
    <div className="absolute top-16 right-4 w-64 z-50">
      {/* triangle pointer */}
      <div
        className="absolute -top-2 right-8 w-4 h-4 bg-element transform rotate-45"
        style={{ clipPath: "polygon(100% 0, 0% 100%, 0 0)" }}
      />

      {/* popup */}
      <div className="bg-element p-4 rounded-lg shadow-lg relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-text/80 hover:text-text"
          aria-label="Close popup"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-text mb-2">
          Save Your Progress!
        </h2>
        <p className="text-text/90 text-sm mb-4">
          Sign up to track your daily progress!
        </p>
      </div>
    </div>
  );
}

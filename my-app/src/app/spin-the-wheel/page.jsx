"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { ArrowLeft, Sparkles, Coins, Gift, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import confetti from "canvas-confetti";

export default function SpinWheelPage() {
    const router = useRouter();
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [reward, setReward] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    // Wheel Segments and Colors
    const SEGMENTS = [
        { label: "50", value: 50, color: "var(--light-pink)" },
        { label: "100", value: 100, color: "var(--light-blue)" },
        { label: "200", value: 200, color: "var(--green)" },
        { label: "500", value: 500, color: "var(--light-orange)" },
        { label: "1000", value: 1000, color: "var(--orange)" },
    ];

    // Logic: 5 segments. Each is 72 degrees.
    // 0: [0, 72], 1: [72, 144], ... (assuming clockwise from 0 top)
    // To verify: If I want index 0 at top, and 0 starts at top-right (standard CSS conic), 
    // I need to account for rotation.
    // Let's implement dynamic calculation.

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setLoading(false);
            if (!user) {
                // router.push("/login"); // Optional: redirect or show login prompt
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSpin = async () => {
        if (isSpinning || !authUser) return;
        setIsSpinning(true);
        setReward(null);
        setError(null);
        setShowModal(false);

        try {
            // 1. Call API
            const token = await authUser.getIdToken();
            const res = await fetch("/api/user/spin-wheel", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // 2. Calculate Rotation
            // We want the winning segment to land at the TOP.
            // Top is 0 degrees (visually).
            // If we use conic-gradient, segment i starts at `i * 72`.
            // Center of segment i is `i * 72 + 36`.
            // We want this center to be at 0 degrees (Top).
            // So we rotate the wheel by `- (i * 72 + 36)`?
            // CSS Rotate(0) -> 12 o'clock? MDN transform: rotate() starts from 12 o'clock if element is standard? 
            // No, usually it depends on how we draw it.
            // Let's assume the wheel element:
            // conic-gradient starts at 12 o'clock (0deg).
            // Segment 0 (Red) is 0-72 deg (Top Right). Center: 36 deg.
            // To bring Center (36) to Top (0/360), we need to rotate result:
            // `currentRotation + (360 - 36)`.
            // Generalizing: `targetAngle = 360 - (index * 72 + 36)`.
            // Add multiple full spins (e.g. 5 * 360).
            // Add random jitter? No, strict center is cleaner, or minimal jitter.

            const index = data.rewardIndex; // 0 to 4
            const segmentAngle = 360 / SEGMENTS.length; // 72
            const offset = segmentAngle / 2; // 36

            // Calculate target rotation to land the segment at the top (0 degrees)
            // Since conic-gradient starts at 0deg (Top) and goes clockwise:
            // Segment 0 is [0, 72]. Center 36.
            // To put 36 at 0, we rotate -36 or 324.
            // Segment 1 is [72, 144]. Center 108.
            // To put 108 at 0, we rotate -108 or 252.
            // Formula: `360 - (index * segmentAngle + offset)`.

            const targetRotationBase = 360 - (index * segmentAngle + offset);

            // Add spins (min 5 spins = 1800 deg)
            const spins = 360 * 5;
            // We need to accumulate rotation so it doesn't spin back
            // Current rotation modulo 360 gives us current position? No, we just add to current `rotation` state.
            // Actually simpler: newRotation = rotation + spins + adjustment.
            // But we need to hit specific angle.
            // `currentRotation` might be 1940.
            // We want to land at `targetRotationBase`.
            // `nextRotation = currentRotation + spins + (targetRotationBase - (currentRotation % 360))`
            // Simplest: Always add (5 * 360) + differential.

            // Let's just create a large target value.
            const newRotation = rotation + spins + (targetRotationBase - (rotation % 360));
            // Ensure positive monotonic increase?
            // If `targetRotationBase - (rotation % 360)` is negative, it might spin slightly back?
            // Better: `rotation + spins + (360 - (rotation % 360)) + targetRotationBase` -> lands at `targetRotationBase` modulo 360.

            // Allow slight jitter for realism (within +/- 10 deg)
            const jitter = Math.floor(Math.random() * 20) - 10;

            // Actually, keep it simple first.

            // Fixed calculation:
            // We want final state % 360 = targetRotationBase.
            // We are at `rotation`.
            // Target = rotation + (360 - rotation % 360) + (5 * 360) + targetRotationBase;
            // Step 1: Finish current cycle to 0. (360 - rot%360)
            // Step 2: Add 5 full spins.
            // Step 3: Add target offset.

            const finalRotation = rotation + (360 - (rotation % 360)) + (5 * 360) + targetRotationBase;

            setRotation(finalRotation);

            setTimeout(() => {
                setReward(data.rewardAmount);
                setIsSpinning(false);
                setShowModal(true);
                triggerConfetti();
            }, 5000); // 5s animation duration

        } catch (err) {
            console.error(err);
            setError(err.message);
            setIsSpinning(false);
        }
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#FC965C", "#F3CCE7", "#A5C5F2"],
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#FC965C", "#F3CCE7", "#A5C5F2"],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: "var(--bg)" }}>

                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-30 bg-[var(--light-orange)]" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-30 bg-[var(--light-blue)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[url('/noise.png')] opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-lg flex flex-col items-center text-center"
                >
                    <button
                        onClick={() => router.back()}
                        className="absolute -top-16 left-0 flex items-center gap-2 text-[var(--dark-teal)] font-bold hover:opacity-70 transition"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>

                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--dark-teal)] drop-shadow-sm">
                        Spin & Win!
                    </h1>
                    <p className="text-[var(--font)] mb-10 text-lg">
                        Try your luck and earn big rewards!
                    </p>

                    {/* Wheel Container */}
                    <div className="relative w-80 h-80 md:w-96 md:h-96">
                        {/* Pointer */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                            <div className="w-8 h-8 bg-white rotate-45 transform shadow-lg border-2 border-[var(--dark-teal)] rounded-sm" />
                            <div className="w-4 h-4 bg-[var(--dark-teal)] rotate-45 transform absolute top-2 left-2 rounded-sm" />
                        </div>

                        {/* Wheel */}
                        <motion.div
                            className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative"
                            animate={{ rotate: rotation }}
                            transition={{ duration: 5, ease: "circOut" }}
                            style={{
                                background: `conic-gradient(
                  ${SEGMENTS[0].color} 0% 20%,
                  ${SEGMENTS[1].color} 20% 40%,
                  ${SEGMENTS[2].color} 40% 60%,
                  ${SEGMENTS[3].color} 60% 80%,
                  ${SEGMENTS[4].color} 80% 100%
                )`
                            }}
                        >
                            {/* Segments Text */}
                            {SEGMENTS.map((seg, i) => {
                                // Determine rotation for text
                                const rotation = (i * 72) + 36;
                                return (
                                    <div
                                        key={i}
                                        className="absolute w-full h-full top-0 left-0 flex justify-center pt-8"
                                        style={{ transform: `rotate(${rotation}deg)` }}
                                    >
                                        <div className="font-bold text-white text-2xl drop-shadow-md flex flex-col items-center">
                                            <Coins className="w-6 h-6 mb-1 opacity-90" />
                                            {seg.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>

                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-[var(--light-orange)] z-10">
                            <Gift className="w-8 h-8 text-[var(--orange)]" />
                        </div>
                    </div>

                    {/* Spin Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSpin}
                        disabled={isSpinning || !authUser}
                        className="mt-12 px-10 py-4 rounded-full text-xl font-bold text-white shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(135deg, var(--light-orange) 0%, var(--orange) 100%)"
                        }}
                    >
                        {isSpinning ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Spinning...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                Spin Now!
                            </>
                        )}
                    </motion.button>

                    {!authUser && !loading && (
                        <p className="mt-4 text-sm text-[var(--font)]">Please login to play.</p>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-100 text-red-600 rounded-xl font-medium">
                            {error}
                        </div>
                    )}
                </motion.div>

                {/* Reward Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.8, y: 20 }}
                                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--orange)]" />

                                <div className="w-20 h-20 mx-auto bg-[var(--light-pink)] rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <Coins className="w-10 h-10 text-[var(--dark-teal)]" />
                                </div>

                                <h2 className="text-3xl font-bold text-[var(--dark-teal)] mb-2">
                                    Congratulations!
                                </h2>
                                <p className="text-[var(--font)] mb-6 text-lg">
                                    You won <span className="font-bold text-[var(--orange)] text-2xl">{reward}</span> coins!
                                </p>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                                    style={{ backgroundColor: "var(--dark-teal)" }}
                                >
                                    Awesome!
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </>
    );
}

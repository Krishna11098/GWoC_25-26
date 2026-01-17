"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import Navbar from "@/components/Navbar";
import { ArrowLeft, RotateCcw, Trophy, HelpCircle, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

// Tile colors based on value
const TILE_COLORS = {
    2: { bg: "#ffffff", text: "#1e1e1e", textParams: { fontSize: "2.5rem" } },
    4: { bg: "#f7d57c", text: "#1e1e1e", textParams: { fontSize: "2.5rem" } },
    8: { bg: "#f2b179", text: "#f9f6f2", textParams: { fontSize: "2.5rem" } },
    16: { bg: "#f59563", text: "#f9f6f2", textParams: { fontSize: "2rem" } },
    32: { bg: "#f67c5f", text: "#f9f6f2", textParams: { fontSize: "2rem" } },
    64: { bg: "#f65e3b", text: "#f9f6f2", textParams: { fontSize: "2rem" } },
    128: { bg: "#edcf72", text: "#f9f6f2", textParams: { fontSize: "1.8rem", textShadow: "0 0 5px rgba(0,0,0,0.2)" } },
    256: { bg: "#edcc61", text: "#f9f6f2", textParams: { fontSize: "1.8rem", textShadow: "0 0 5px rgba(0,0,0,0.2)" } },
    512: { bg: "#edc850", text: "#f9f6f2", textParams: { fontSize: "1.8rem", textShadow: "0 0 5px rgba(0,0,0,0.2)" } },
    1024: { bg: "#edc53f", text: "#f9f6f2", textParams: { fontSize: "1.5rem", textShadow: "0 0 5px rgba(0,0,0,0.2)" } },
    2048: { bg: "#edc22e", text: "#f9f6f2", textParams: { fontSize: "1.5rem", boxShadow: "0 0 10px #edc22e" } },
};

const GRID_SIZE = 4;

export default function Game2048() {
    const router = useRouter();
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [hasWon, setHasWon] = useState(false); // To continue playing after winning
    const [authUser, setAuthUser] = useState(null);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [moveDirection, setMoveDirection] = useState(null);
    const boardRef = useRef(null);

    // Initialize game
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
        });

        // Load best score from local storage
        if (typeof window !== "undefined") {
            const savedBest = localStorage.getItem("2048-bestScore");
            if (savedBest) setBestScore(parseInt(savedBest));
        }

        startNewGame();
        return () => unsubscribe();
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver) return;

            switch (e.key) {
                case "ArrowUp": e.preventDefault(); move("up"); break;
                case "ArrowDown": e.preventDefault(); move("down"); break;
                case "ArrowLeft": e.preventDefault(); move("left"); break;
                case "ArrowRight": e.preventDefault(); move("right"); break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [board, gameOver]);

    // Game Logic
    const startNewGame = () => {
        const newBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setHasWon(false);
        addRandomTile(newBoard);
        addRandomTile(newBoard);
        setBoard(newBoard);
    };

    const addRandomTile = (currentBoard) => {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentBoard[r][c] === 0) emptyCells.push({ r, c });
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% chance of 2, 10% chance of 4
            currentBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const move = (direction) => {
        setMoveDirection(direction);

        // Deep copy board
        let newBoard = board.map(row => [...row]);
        let moved = false;
        let scoreToAdd = 0;


        // Let's use rotation helper
        // 0 rot: left
        // 1 rot: down? 
        // Let's implement specific row processing instead of rotation for clarity or use rotation
        // Up: rotate 270 (CCW), move Left, rotate 90.
        // Right: rotate 180, move Left, rotate 180
        // Down: rotate 90 (CCW), move Left, rotate 270.

        let rotations = 0;
        if (direction === "up") rotations = 1; // Transpose? No, let's use standard functional logic
        if (direction === "right") rotations = 2;
        if (direction === "down") rotations = 3;

        // Helper: Rotate matrix Clockwise
        const rotate = (matrix) => {
            return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
        };

        for (let i = 0; i < rotations; i++) newBoard = rotate(newBoard);

        // Process Left Move
        for (let r = 0; r < GRID_SIZE; r++) {
            const row = newBoard[r];
            const result = processRow(row);
            newBoard[r] = result.newRow;
            scoreToAdd += result.score;
            if (result.moved) moved = true;
        }

        // Rotate back (4 - rotations)
        for (let i = 0; i < (4 - rotations) % 4; i++) newBoard = rotate(newBoard);

        if (moved) {
            addRandomTile(newBoard);
            setBoard(newBoard);
            const newScore = score + scoreToAdd;
            setScore(newScore);

            if (newScore > bestScore) {
                setBestScore(newScore);
                localStorage.setItem("2048-bestScore", newScore);
            }

            // Check Win
            if (!hasWon) {
                for (let r = 0; r < GRID_SIZE; r++) {
                    for (let c = 0; c < GRID_SIZE; c++) {
                        if (newBoard[r][c] === 2048) {
                            setGameWon(true);
                            setHasWon(true);
                            triggerConfetti();
                        }
                    }
                }
            }

            // Check Game Over
            if (checkGameOver(newBoard)) {
                setGameOver(true);
            }
        }
    };

    const processRow = (row) => {
        // 1. Remove zeros
        let filtered = row.filter(val => val !== 0);
        let newRow = [];
        let score = 0;
        let moved = false;

        // 2. Merge
        for (let i = 0; i < filtered.length; i++) {
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                const mergedVal = filtered[i] * 2;
                newRow.push(mergedVal);
                score += mergedVal;
                i++; // Skip next
                moved = true; // technically a merge is a move of sorts from perspective of distinct elements
            } else {
                newRow.push(filtered[i]);
            }
        }

        // 3. Pad with zeros
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }

        // Check if distinct from original (to detect 'moved' state)
        // Note: 'moved' in 2048 means if the board configuration changed.
        for (let i = 0; i < GRID_SIZE; i++) {
            if (row[i] !== newRow[i]) moved = true;
        }

        return { newRow, score, moved };
    };

    const checkGameOver = (currentBoard) => {
        // 1. Empty cells exist?
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentBoard[r][c] === 0) return false;
            }
        }

        // 2. Adjacent matches?
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const val = currentBoard[r][c];
                if (c < GRID_SIZE - 1 && currentBoard[r][c + 1] === val) return false;
                if (r < GRID_SIZE - 1 && currentBoard[r + 1][c] === val) return false;
            }
        }

        return true; // No moves left
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    };

    const handleClaimReward = async () => {
        if (!authUser || score === 0) return;

        try {
            const token = await authUser.getIdToken();
            const res = await fetch("/api/games/2048/reward", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ score })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Congratulations! You earned ${data.coinsEarned} coins!`);
                router.push("/profile");
            } else {
                alert("Failed to claim rewards. " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error claiming reward.");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--dark-teal)]">
            <Navbar />

            <main className="pt-28 pb-10 px-4 md:px-8 flex flex-col items-center max-w-2xl mx-auto">

                {/* Header */}
                <div className="w-full flex justify-between items-start mb-8">
                    <div>
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-6xl md:text-8xl font-black text-[#1e1e1e] tracking-tighter"
                        >
                            2048
                        </motion.h1>
                        <p className="text-[var(--font)] mt-2 font-medium">
                            Combine tiles to reach the ultimate number.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="bg-[#bbada0] p-3 rounded-lg text-center min-w-[80px]">
                            <span className="block text-xs font-bold text-[#eee4da] uppercase tracking-wider">Score</span>
                            <span className="block text-2xl font-bold text-white">{score}</span>
                        </div>
                        {/* <div className="bg-[#bbada0] p-2 rounded-lg text-center min-w-[80px]">
                    <span className="block text-xs font-bold text-[#eee4da] uppercase tracking-wider">Best</span>
                    <span className="block text-xl font-bold text-white">{bestScore}</span>
                </div> */}
                    </div>
                </div>

                {/* Game of the Day Banner */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#f7d57c] border-2 border-black rounded-full px-6 py-2 mb-6 font-bold flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Trophy className="w-5 h-5" />
                    GAME OF THE DAY - EARN COINS!
                </motion.div>

                {/* Action Bar */}
                <div className="w-full flex justify-between items-center mb-6">
                    <button
                        onClick={() => setShowHowToPlay(true)}
                        className="bg-[#f2b179] text-white px-4 py-2 rounded font-bold hover:bg-[#f59563] transition flex items-center gap-2"
                    >
                        <HelpCircle className="w-5 h-5" /> HOW TO PLAY
                    </button>
                    <button
                        onClick={startNewGame}
                        className="bg-[#8f7a66] text-white px-6 py-2 rounded font-bold hover:bg-[#9c8470] transition flex items-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" /> NEW GAME
                    </button>
                </div>

                {/* Game Board Container */}
                <div className="relative bg-white border-[3px] border-black rounded-xl p-3 md:p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-[#1e1e1e] rounded-lg p-3 relative touch-none" ref={boardRef}>
                        {/* Grid Background */}
                        <div className="grid grid-cols-4 gap-3">
                            {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => (
                                <div key={i} className="w-16 h-16 md:w-24 md:h-24 bg-[#2d2d2d] rounded-md ring-1 ring-white/5" />
                            ))}
                        </div>

                        {/* Tiles */}
                        <div className="absolute top-3 left-3 right-3 bottom-3">
                            {board.map((row, r) =>
                                row.map((val, c) => {
                                    if (val === 0) return null;
                                    const color = TILE_COLORS[val] || TILE_COLORS[2048];
                                    return (
                                        <motion.div
                                            key={`${r}-${c}-${val}`} // Unique key for animation - note: simple approach, optimized would track IDs
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="absolute flex items-center justify-center rounded-md font-bold shadow-sm"
                                            style={{
                                                width: `calc((100% - 36px) / 4)`, // (100% - 3 gaps * 12px) / 4 if parent is exact? actually grid gap is 12px (gap-3).
                                                height: `calc((100% - 36px) / 4)`,
                                                // Position math based on row/col index
                                                top: `calc(${r} * ((100% - 36px) / 4) + ${r} * 12px)`,
                                                left: `calc(${c} * ((100% - 36px) / 4) + ${c} * 12px)`,
                                                backgroundColor: color.bg,
                                                color: color.text,
                                                ...color.textParams
                                            }}
                                        >
                                            {val}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Overlays */}
                        <AnimatePresence>
                            {gameOver && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-[#eee4da]/80 flex flex-col items-center justify-center rounded-lg z-10"
                                >
                                    <h2 className="text-4xl font-bold text-[#776e65] mb-4">Game Over!</h2>
                                    <button
                                        onClick={handleClaimReward}
                                        className="bg-[#8f7a66] text-white px-6 py-3 rounded font-bold text-xl shadow-lg hover:scale-105 transition"
                                    >
                                        Claim Reward
                                    </button>
                                    <button
                                        onClick={startNewGame}
                                        className="mt-4 text-[#776e65] font-bold underline"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}

                            {gameWon && !hasWon && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-[#edc22e]/80 flex flex-col items-center justify-center rounded-lg z-10 text-white"
                                >
                                    <h2 className="text-4xl font-bold mb-4">You Won!</h2>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setGameWon(false)} // Keep playing
                                            className="bg-white/20 border-2 border-white px-6 py-2 rounded font-bold shadow-lg hover:bg-white/30 transition"
                                        >
                                            Keep Playing
                                        </button>
                                        <button
                                            onClick={handleClaimReward}
                                            className="bg-white text-[#edc22e] px-6 py-2 rounded font-bold shadow-lg hover:scale-105 transition"
                                        >
                                            Claim Coins
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-2 text-center text-gray-500 font-bold text-sm tracking-widest uppercase py-2">
                        Use Arrow Keys or Buttons
                    </div>
                </div>

                {/* Mobile Controls */}
                <div className="mt-8 grid grid-cols-3 gap-2">
                    <div />
                    <button
                        className="bg-white border-2 border-black rounded-xl p-4 active:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        onClick={() => move("up")}
                    >
                        <ChevronUp className="w-6 h-6 mx-auto" />
                    </button>
                    <div />
                    <button
                        className="bg-white border-2 border-black rounded-xl p-4 active:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        onClick={() => move("left")}
                    >
                        <ChevronLeft className="w-6 h-6 mx-auto" />
                    </button>
                    <button
                        className="bg-white border-2 border-black rounded-xl p-4 active:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        onClick={() => move("down")}
                    >
                        <ChevronDown className="w-6 h-6 mx-auto" />
                    </button>
                    <button
                        className="bg-white border-2 border-black rounded-xl p-4 active:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        onClick={() => move("right")}
                    >
                        <ChevronRight className="w-6 h-6 mx-auto" />
                    </button>
                </div>

                {/* How To Play Modal */}
                <AnimatePresence>
                    {showHowToPlay && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                            onClick={() => setShowHowToPlay(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white rounded-xl p-6 max-w-md w-full relative border-4 border-[var(--dark-teal)] shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowHowToPlay(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold mb-4 text-[var(--dark-teal)]">How To Play</h2>
                                <ul className="space-y-3 list-disc pl-5 text-[var(--font)]">
                                    <li>Use your <strong>arrow keys</strong> or the on-screen buttons to move the tiles.</li>
                                    <li>Tiles with the same number merge into one when they touch.</li>
                                    <li>Add them up to reach <strong>2048!</strong></li>
                                    <li><strong>Earn Coins:</strong> When the game ends, claim coins based on your score!</li>
                                </ul>
                                <button
                                    onClick={() => setShowHowToPlay(false)}
                                    className="w-full mt-6 bg-[var(--dark-teal)] text-white font-bold py-3 rounded-lg hover:bg-opacity-90"
                                >
                                    Got it!
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main >
        </div >
    );
}

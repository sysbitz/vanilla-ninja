import confetti from "canvas-confetti";

export function celebrate(stars: 1 | 2 | 3 = 3) {
  const colors = ["#facc15", "#22d3ee", "#a78bfa", "#22c55e", "#f97316"];
  const burst = (originX: number) => {
    confetti({
      particleCount: 80 + stars * 30,
      spread: 70,
      startVelocity: 45,
      origin: { x: originX, y: 0.6 },
      colors,
      scalar: 1.1,
    });
  };
  burst(0.25);
  setTimeout(() => burst(0.5), 120);
  setTimeout(() => burst(0.75), 240);
}

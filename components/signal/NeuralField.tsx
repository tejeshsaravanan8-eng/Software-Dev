"use client";
import { useEffect, useRef, useState } from "react";

type Point3 = { x: number; y: number; z: number };
type ProjectedPoint = Point3 & { scale: number; light: number };
export type NeuralFieldProps = { paused: boolean; reducedMotion: boolean; signalCount: number };

/** Abstract network illustration. Fixed edges, 30fps cap, capped DPR,
 * and no animation while hidden, offscreen, paused, or under reduced motion. */
export function NeuralField({ paused, reducedMotion, signalCount }: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneTime = useRef(0);
  const triggerSignal = useRef<(() => void) | null>(null);
  const hasSignal = useRef(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) { setUnavailable(true); return; }
    const ctx = context;
    const count = window.matchMedia("(pointer: coarse)").matches ? 100 : 156;
    const points: Point3[] = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const angle = Math.PI * (3 - Math.sqrt(5)) * i;
      return { x: Math.cos(angle) * ring, y, z: Math.sin(angle) * ring };
    });
    const edges: [number, number][] = [];
    // The only quadratic operation happens once, outside the animation loop.
    for (let i = 0; i < count; i++) {
      const nearest = points.map((p, j) => ({ j, distance: Math.hypot(p.x - points[i].x, p.y - points[i].y, p.z - points[i].z) }))
        .filter(p => p.j !== i).sort((a, b) => a.distance - b.distance).slice(0, 5);
      for (const other of nearest) if (other.j > i) edges.push([i, other.j]);
    }
    let width = 0, height = 0, frame = 0, lastFrame = 0;
    let inView = true, active = false, pulseAt = -10000;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, px: -1000, py: -1000 };

    function draw() {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const time = sceneTime.current;
      const still = paused || reducedMotion;
      const cx = width * 0.5, cy = height * 0.39;
      const radius = Math.min(width * 0.365, height * 0.285);
      const spin = time * 0.000052 + 0.38 + (still ? 0 : pointer.x * 0.3);
      const tilt = -0.22 + (still ? 0 : pointer.y * 0.18);
      const pulse = (time - pulseAt) / 1900;
      const ambient = ctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius * 1.8);
      ambient.addColorStop(0, "rgba(165,112,238,0.18)");
      ambient.addColorStop(0.52, "rgba(207,124,79,0.06)");
      ambient.addColorStop(1, "rgba(38,38,34,0)");
      ctx.fillStyle = ambient; ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 42; i++) {
        ctx.fillStyle = i % 5 === 0 ? "rgba(225,204,176,0.40)" : "rgba(225,204,176,0.15)";
        ctx.beginPath(); ctx.arc(((i * 131.37 + 21) % 997) / 997 * width, ((i * 79.23 + 35) % 619) / 619 * height, i % 5 === 0 ? 1.15 : 0.65, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.ellipse(cx, cy, radius * (1.18 + i * 0.13), radius * (0.38 + i * 0.035), -0.46 + i * 1.07, 0, Math.PI * 2);
        ctx.lineWidth = 0.8; ctx.strokeStyle = i === 0 ? "rgba(204,172,251,0.20)" : "rgba(204,172,251,0.09)"; ctx.stroke();
      }
      const projected: ProjectedPoint[] = points.map((point, i) => {
        const x = point.x * Math.cos(spin) - point.z * Math.sin(spin);
        const rz = point.x * Math.sin(spin) + point.z * Math.cos(spin);
        const y = point.y * Math.cos(tilt) - rz * Math.sin(tilt);
        const z = point.y * Math.sin(tilt) + rz * Math.cos(tilt);
        const scale = 3.8 / (3.8 + z);
        const px = cx + x * radius * scale, py = cy + y * radius * scale;
        const proximity = still ? 0 : Math.max(0, 1 - Math.hypot(px - pointer.px, py - pointer.py) / 95);
        const wave = pulse >= 0 && pulse <= 1.35 && !still
          ? Math.exp(-Math.pow(((point.y + 1) / 2) - pulse, 2) * 100)
          : (still && hasSignal.current && i % 5 === 0 ? 0.65 : 0);
        return { x: px, y: py, z, scale, light: Math.max(proximity, wave) };
      });
      for (const [i, j] of edges) {
        const a = projected[i], b = projected[j];
        const depth = (2 - a.z - b.z) / 4, highlight = Math.max(a.light, b.light);
        ctx.lineWidth = highlight > 0.3 ? 1.2 : 0.7;
        ctx.strokeStyle = highlight > 0.3 ? `rgba(247,184,113,${0.15 + highlight * 0.68})` : `rgba(182,144,242,${0.04 + depth * 0.28})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const sorted = projected.map((p, i) => ({ ...p, index: i })).sort((a, b) => b.z - a.z);
      for (const point of sorted) {
        const depth = (1 - point.z) / 2, bright = point.index % 9 === 0;
        const size = (bright ? 2.8 : 1.45) * point.scale + point.light * 1.7;
        const color = bright || point.light > 0.3 ? "246,208,142" : "196,168,249";
        if (bright || point.light > 0.2) {
          const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 5);
          glow.addColorStop(0, `rgba(${color},${0.22 + point.light * 0.22})`); glow.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(point.x, point.y, size * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(${color},${0.22 + depth * 0.65})`;
        ctx.beginPath(); ctx.arc(point.x, point.y, size, 0, Math.PI * 2); ctx.fill();
      }
    }
    function tick(now: number) {
      if (!active) return;
      frame = requestAnimationFrame(tick);
      if (lastFrame && now - lastFrame < 1000 / 30) return;
      const delta = lastFrame ? Math.min(now - lastFrame, 70) : 0;
      lastFrame = now; sceneTime.current += delta;
      pointer.x += (pointer.targetX - pointer.x) * 0.09;
      pointer.y += (pointer.targetY - pointer.y) * 0.09;
      draw();
    }
    function syncAnimation() {
      const shouldRun = !paused && !reducedMotion && !document.hidden && inView;
      cancelAnimationFrame(frame); active = shouldRun; lastFrame = 0;
      if (shouldRun) frame = requestAnimationFrame(tick);
      else if (inView && !document.hidden) draw();
    }
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    }
    const host = canvas.parentElement!;
    function move(event: PointerEvent) {
      if (paused || reducedMotion || event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      pointer.px = event.clientX - rect.left; pointer.py = event.clientY - rect.top;
      pointer.targetX = (pointer.px / width - 0.5) * 2; pointer.targetY = (pointer.py / height - 0.5) * 2;
    }
    function leave() { pointer.targetX = 0; pointer.targetY = 0; pointer.px = -1000; pointer.py = -1000; }
    triggerSignal.current = () => { hasSignal.current = true; pulseAt = sceneTime.current; if (!active) draw(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncAnimation(); }, { threshold: 0.02 });
    intersection.observe(canvas);
    host.addEventListener("pointermove", move, { passive: true }); host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", syncAnimation);
    resize(); syncAnimation();
    return () => {
      active = false; cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", syncAnimation); triggerSignal.current = null;
    };
  }, [paused, reducedMotion]);

  useEffect(() => { if (signalCount > 0) triggerSignal.current?.(); }, [signalCount]);
  return <>
    <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />
    {unavailable && <p className="canvas-fallback">Connected nodes pass information.<br />Use “Send a signal” to begin exploring.</p>}
  </>;
}

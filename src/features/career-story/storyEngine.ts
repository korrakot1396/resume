/**
 * Career story animation — canvas engine (framework-agnostic).
 *
 * Stage: 1080 × 1350 (4:5). Every frame is a pure function of time `t` (seconds),
 * so the loop is seamless and any moment can be rendered on demand.
 *
 * Timeline (19 s)
 *   0.0 –  2.6  Boot      terminal types `npm run my-journey`, iris opens
 *   2.6 –  6.6  Chapter 1 freshman on campus (petals, stickers, "Day 1!")
 *   6.6 – 10.9  Chapter 2 CS life (code rain, coffee counter, bug squashing, progress bar)
 *  10.9 – 15.3  Chapter 3 graduation (flash, confetti, caps toss, achievement)
 *  15.3 – 19.0  Chapter 4 developer (skyline, UI cards, name + role), fade to loop
 */

export const STAGE_W = 1080;
export const STAGE_H = 1350;
export const DURATION = 19;

const TAU = Math.PI * 2;
const HEAD = '"Fredoka", "Nunito", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
const NAVY = '#171B2E';
const MINT = '#7CF0C5';
const CORAL = '#F26B5B';
const VIOLET = '#6C5CE7';
const INK = '#2B2F45';

/** Character sprite geometry, in source-image pixels. */
const CHAR = { w: 714, h: 1400, eyesX: 318.1, eyesY: 226.8, scale: 0.7 };

type Img = CanvasImageSource;
type Ctx = CanvasRenderingContext2D;

export interface StoryAssets {
  freshman: Img;
  cs: Img;
  grad: Img;
  work: Img;
  eyesBlink: Img;
  eyesHappy: Img;
}

export type StoryAssetUrls = Record<keyof StoryAssets, string>;

/** All on-screen copy. Wrap words in *stars* to colour them as accents. */
export interface StoryText {
  handle: string;
  name: string;
  role: string;
  ch1Title: string;
  ch1Subtitle: string;
  ch1Bubble: string;
  ch2Title: string;
  ch2Subtitle: string;
  ch3Title: string;
  ch3Subtitle: string;
  ch3Achievement: string;
  ch4Title: string;
  ch4Bubble: string;
  ch4Status: string;
  /** Up to 3 skill tags that float in at the end. */
  skills: string[];
}

export const defaultStoryText: StoryText = {
  handle: 'korrakot',
  name: 'Korrakot',
  role: 'Software Developer',
  ch1Title: 'Hello, *University!*',
  ch1Subtitle: 'Freshman year · day one on campus',
  ch1Bubble: 'Day 1!',
  ch2Title: 'Bugs, Coffee & *Code*',
  ch2Subtitle: 'Computer Science · late nights included',
  ch3Title: 'Graduated!',
  ch3Subtitle: 'Officially a Computer Science grad',
  ch3Achievement: "Bachelor's Degree",
  ch4Title: "Hi, I'm *{name}*",
  ch4Bubble: "Let's build!",
  ch4Status: 'status: online',
  skills: ['React', 'TypeScript'],
};

export interface StoryController {
  play(): void;
  pause(): void;
  isPlaying(): boolean;
  /** Current position in the loop, in seconds. */
  time(): number;
  /** Render a single frame at time t (seconds). */
  renderAt(t: number): void;
  /** Re-read the canvas size (call when its CSS size changes). */
  resize(): void;
  destroy(): void;
}

/* ------------------------------------------------------------------ */
/* Maths                                                               */
/* ------------------------------------------------------------------ */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const easeOutBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
};
/** 0 → 1 with a little overshoot, starting at `start`. */
const pop = (t: number, start: number, dur = 0.45) =>
  t <= start ? 0 : easeOutBack(prog(t, start, start + dur));

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Pre-generated scene data (seeded, so every loop is identical)       */
/* ------------------------------------------------------------------ */

interface Word {
  text: string;
  accent: boolean;
}
interface Petal { x: number; sp: number; amp: number; ph: number; rs: number; col: string; sz: number; off: number }
interface Star { x: number; y: number; r: number; ph: number }
interface RainCol { x: number; sp: number; off: number; chars: string[] }
interface Confetto { side: number; vx: number; vy: number; t0: number; col: string; w: number; h: number; ph: number; spin: number; flip: number; fl: number }
interface Drop { x: number; t0: number; col: string; w: number; h: number; ph: number; spin: number; flip: number }
interface Spark { x: number; y: number; s: number; ph: number }
interface Bldg { x: number; w: number; h: number; lit: number[] }

interface World {
  height: number;
  extra: number;
  A: StoryAssets;
  T: StoryText;
  words1: Word[];
  words2: Word[];
  words4: Word[];
  petals: Petal[];
  stars: Star[];
  rain: RainCol[];
  burst: Confetto[];
  drizzle: Drop[];
  sparks: Spark[];
  skyBack: Bldg[];
  skyFront: Bldg[];
}

const CONFETTI = [CORAL, '#FFD166', MINT, '#82AAFF', '#C792EA', '#FFFFFF'];

function parseWords(src: string): Word[] {
  let open = false;
  return src
    .split(' ')
    .filter(Boolean)
    .map((raw) => {
      let text = raw;
      let accent = open;
      if (text.startsWith('*')) {
        text = text.slice(1);
        accent = true;
        open = true;
      }
      if (text.endsWith('*')) {
        text = text.slice(0, -1);
        open = false;
      }
      return { text, accent };
    });
}

function buildWorld(A: StoryAssets, T: StoryText): World {
  const r = mulberry32(20261005);
  const rand = (a: number, b: number) => a + (b - a) * r();
  const pick = <V>(arr: V[]): V => arr[Math.floor(r() * arr.length)] as V;

  const petals: Petal[] = Array.from({ length: 26 }, () => ({
    x: rand(0, STAGE_W),
    sp: rand(90, 170),
    amp: rand(25, 60),
    ph: rand(0, TAU),
    rs: rand(-2, 2),
    col: pick(['#F9B8C6', '#FFD3DC', '#B9E4C9', '#FFC9A8']),
    sz: rand(0.7, 1.3),
    off: rand(0, 1600),
  }));

  const stars: Star[] = Array.from({ length: 70 }, () => ({
    x: rand(0, STAGE_W),
    y: rand(0, 900),
    r: rand(1.2, 3.2),
    ph: rand(0, TAU),
  }));

  const glyphs = '01{}<>/;=()[]$#'.split('');
  const rain: RainCol[] = Array.from({ length: 16 }, (_, i) => ({
    x: 34 + i * 67,
    sp: rand(60, 140),
    off: rand(0, 1500),
    chars: Array.from({ length: 14 }, () => pick(glyphs)),
  }));

  const burst: Confetto[] = Array.from({ length: 150 }, (_, i) => ({
    side: i % 2 === 0 ? -1 : 1,
    vx: rand(550, 1450),
    vy: -rand(3000, 4300),
    t0: 10.95 + rand(0, 0.14),
    col: pick(CONFETTI),
    w: rand(10, 16),
    h: rand(18, 28),
    ph: rand(0, TAU),
    spin: rand(-6, 6),
    flip: rand(5, 11),
    fl: rand(2, 4),
  }));

  const drizzle: Drop[] = Array.from({ length: 48 }, () => ({
    x: rand(20, STAGE_W - 20),
    t0: rand(11.7, 14.9),
    col: pick(CONFETTI),
    w: rand(10, 15),
    h: rand(16, 24),
    ph: rand(0, TAU),
    spin: rand(-4, 4),
    flip: rand(4, 9),
  }));

  const sparkSpots: [number, number][] = [
    [120, 420], [960, 400], [210, 600], [880, 610], [90, 760], [1000, 820],
    [180, 980], [920, 1020], [330, 360], [760, 350], [60, 1130], [1030, 1160],
  ];
  const sparks: Spark[] = sparkSpots.map(([x, y]) => ({ x, y, s: rand(14, 26), ph: rand(0, TAU) }));

  const sky = (minW: number, maxW: number, minH: number, maxH: number, windows: boolean): Bldg[] => {
    const out: Bldg[] = [];
    let x = -30;
    while (x < STAGE_W + 30) {
      const w = rand(minW, maxW);
      const h = rand(minH, maxH);
      const cols = Math.max(1, Math.floor((w - 24) / 34));
      const rows = Math.max(1, Math.floor((h - 40) / 44));
      const lit = windows ? Array.from({ length: cols * rows }, () => (r() < 0.32 ? rand(0.1, TAU) : 0)) : [];
      out.push({ x, w, h, lit });
      x += w + rand(4, 18);
    }
    return out;
  };

  return {
    height: STAGE_H, extra: 0,
    A,
    T,
    words1: parseWords(T.ch1Title),
    words2: parseWords(T.ch2Title),
    words4: parseWords(T.ch4Title.replace('{name}', T.name)),
    petals,
    stars,
    rain,
    burst,
    drizzle,
    sparks,
    skyBack: sky(70, 130, 300, 560, false),
    skyFront: sky(100, 160, 170, 380, true),
  };
}

/* ------------------------------------------------------------------ */
/* Drawing primitives                                                  */
/* ------------------------------------------------------------------ */

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  c.beginPath();
  c.moveTo(x + k, y);
  c.arcTo(x + w, y, x + w, y + h, k);
  c.arcTo(x + w, y + h, x, y + h, k);
  c.arcTo(x, y + h, x, y, k);
  c.arcTo(x, y, x + w, y, k);
  c.closePath();
}

function circle(c: Ctx, x: number, y: number, r: number, fill: string) {
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = fill;
  c.fill();
}

function tri(c: Ctx, ax: number, ay: number, bx: number, by: number, cx: number, cy: number, fill: string) {
  c.beginPath();
  c.moveTo(ax, ay);
  c.lineTo(bx, by);
  c.lineTo(cx, cy);
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

function vGradient(c: Ctx, top: string, bottom: string, height = STAGE_H) {
  const g = c.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  c.fillStyle = g;
  c.fillRect(0, 0, STAGE_W, height);
}

function drawCheck(c: Ctx, x: number, y: number, r: number, color: string, lw: number) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = lw;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(x - r * 0.62, y + r * 0.02);
  c.lineTo(x - r * 0.15, y + r * 0.5);
  c.lineTo(x + r * 0.66, y - r * 0.5);
  c.stroke();
  c.restore();
}

/** Scale-in wrapper around a local drawing at (x, y). */
function withPop(c: Ctx, x: number, y: number, s: number, alpha: number, draw: () => void) {
  if (s <= 0.001 || alpha <= 0) return;
  c.save();
  c.globalAlpha *= clamp01(alpha);
  c.translate(x, y);
  c.scale(s, s);
  draw();
  c.restore();
}

/** Gentle push-in camera for a scene. */
function cam(c: Ctx, p: number, amount = 0.04, cx = 540, cy = 760) {
  const s = 1 + amount * easeInOutCubic(p);
  c.translate(cx, cy);
  c.scale(s, s);
  c.translate(-cx, -cy);
}

function fitFont(c: Ctx, font: (size: number) => string, size: number, text: string, maxW: number) {
  c.font = font(size);
  const w = c.measureText(text).width;
  if (w > maxW) {
    size = Math.floor((size * maxW) / w);
    c.font = font(size);
  }
  return size;
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

function drawChip(c: Ctx, label: string, cx: number, cy: number, bg: string, fg: string, s: number) {
  c.font = `700 22px ${MONO}`;
  const w = c.measureText(label).width + 46;
  withPop(c, cx, cy, s, s * 3, () => {
    rr(c, -w / 2, -23, w, 46, 23);
    c.fillStyle = bg;
    c.fill();
    c.fillStyle = fg;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(label, 0, 1);
  });
}

function drawTitle(
  c: Ctx, words: Word[], cx: number, baseline: number, size: number,
  color: string, accent: string, t: number, start: number, stagger: number,
) {
  c.font = `700 ${size}px ${HEAD}`;
  const space = c.measureText(' ').width;
  const widths = words.map((w) => c.measureText(w.text).width);
  const total = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
  const fit = Math.min(1, (STAGE_W - 110) / total);
  c.save();
  c.translate(cx, baseline);
  c.scale(fit, fit);
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  let x = -total / 2;
  words.forEach((w, i) => {
    const ww = widths[i] ?? 0;
    const a = start + i * stagger;
    const p = prog(t, a, a + 0.5);
    if (p > 0) {
      const s = 0.35 + 0.65 * easeOutBack(p);
      const dy = (1 - easeOutCubic(p)) * 26;
      c.save();
      c.globalAlpha *= clamp01(p * 3);
      c.translate(x + ww / 2, dy - size * 0.34);
      c.scale(s, s);
      c.fillStyle = w.accent ? accent : color;
      c.fillText(w.text, 0, size * 0.34);
      c.restore();
    }
    x += ww + space;
  });
  c.restore();
}

function drawSubtitle(c: Ctx, text: string, cx: number, baseline: number, size: number, color: string, t: number, start: number) {
  const p = prog(t, start, start + 0.55);
  if (p <= 0) return;
  c.save();
  c.globalAlpha *= p;
  fitFont(c, (s) => `500 ${s}px ${HEAD}`, size, text, STAGE_W - 140);
  c.fillStyle = color;
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.fillText(text, cx, baseline + (1 - easeOutCubic(p)) * 18);
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Character                                                           */
/* ------------------------------------------------------------------ */

type EyeState = 'blink' | 'happy' | null;

function eyesAt(t: number, blinks: number[], happy?: [number, number]): EyeState {
  if (happy && t >= happy[0] && t <= happy[1]) return 'happy';
  for (const b of blinks) if (t >= b && t <= b + 0.14) return 'blink';
  return null;
}

function drawChar(
  c: Ctx, w: World, img: Img, eyes: EyeState, t: number,
  o: { dx?: number; dy?: number; scale?: number } = {},
) {
  const k = CHAR.scale * (1 + Math.min(w.extra / 1600, .48)) * (o.scale ?? 1);
  const breath = 1 + 0.006 * Math.sin((t * TAU) / 2.6);
  const sway = 0.006 * Math.sin((t * TAU) / 5.2);
  c.save();
  c.translate(STAGE_W / 2 + (o.dx ?? 0), w.height + 14 + (o.dy ?? 0));
  c.rotate(sway);
  c.scale(k, k * breath);
  c.drawImage(img, -CHAR.w / 2, -CHAR.h);
  const overlay = eyes === 'blink' ? w.A.eyesBlink : eyes === 'happy' ? w.A.eyesHappy : null;
  if (overlay) c.drawImage(overlay, -CHAR.w / 2 + CHAR.eyesX, -CHAR.h + CHAR.eyesY);
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

function drawStar5(c: Ctx, r: number, fill: string) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.48;
    c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

function drawSparkle(c: Ctx, x: number, y: number, s: number, fill: string) {
  if (s <= 0.5) return;
  c.beginPath();
  c.moveTo(x, y - s);
  c.quadraticCurveTo(x, y, x + s, y);
  c.quadraticCurveTo(x, y, x, y + s);
  c.quadraticCurveTo(x, y, x - s, y);
  c.quadraticCurveTo(x, y, x, y - s);
  c.fillStyle = fill;
  c.fill();
}

function drawPencil(c: Ctx) {
  c.rotate(-0.55);
  rr(c, -92, -15, 26, 30, 7);
  c.fillStyle = '#F48FA0';
  c.fill();
  c.fillStyle = '#C9CED9';
  c.fillRect(-70, -15, 12, 30);
  c.fillStyle = '#FFC24B';
  c.fillRect(-58, -15, 108, 30);
  c.fillStyle = '#F0A93B';
  c.fillRect(-58, -2, 108, 6);
  tri(c, 50, -15, 50, 15, 86, 0, '#F6D3A5');
  tri(c, 73, -6, 73, 6, 86, 0, '#5B5F73');
}

function drawBadge(c: Ctx, label: string) {
  circle(c, 0, 0, 48, '#7CC9A5');
  c.beginPath();
  c.arc(0, 0, 39, 0, TAU);
  c.strokeStyle = 'rgba(255,255,255,0.55)';
  c.lineWidth = 3;
  c.setLineDash([6, 6]);
  c.stroke();
  c.setLineDash([]);
  c.font = `700 36px ${HEAD}`;
  c.fillStyle = '#FFFFFF';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(label, 0, 2);
}

function drawCloud(c: Ctx, x: number, y: number, s: number) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.fillStyle = 'rgba(255,255,255,0.92)';
  c.beginPath();
  c.arc(-60, 10, 42, 0, TAU);
  c.arc(-10, -14, 58, 0, TAU);
  c.arc(52, 4, 46, 0, TAU);
  c.fill();
  rr(c, -100, 8, 196, 46, 23);
  c.fill();
  c.restore();
}

function drawTree(c: Ctx, x: number, y: number, s: number, t: number) {
  const sway = Math.sin(t * 1.3) * 3;
  c.fillStyle = '#C9A27E';
  c.fillRect(x - 10 * s, y - 10 * s, 20 * s, 150 * s);
  circle(c, x - 58 * s + sway, y - 4 * s, 64 * s, '#86C39C');
  circle(c, x + 56 * s + sway, y - 16 * s, 70 * s, '#86C39C');
  circle(c, x + sway, y - 70 * s, 92 * s, '#9ED2B0');
  circle(c, x - 30 * s + sway, y - 100 * s, 40 * s, '#B3DEC1');
}

function drawCampus(c: Ctx, t: number) {
  const wall = '#DDE4F4';
  const shade = '#C9D3EA';
  const roof = '#BCC7E2';
  c.fillStyle = shade;
  c.fillRect(80, 905, 920, 42);
  c.fillStyle = wall;
  c.fillRect(100, 947, 880, 420);
  tri(c, 240, 905, 540, 785, 840, 905, roof);
  c.fillStyle = '#EEF2FA';
  for (let i = 0; i < 10; i++) c.fillRect(132 + i * 88, 978, 24, 400);
  // clock tower (right)
  c.fillStyle = shade;
  c.fillRect(815, 660, 100, 250);
  tri(c, 798, 666, 865, 586, 932, 666, roof);
  circle(c, 865, 738, 33, '#F8FAFF');
  c.strokeStyle = '#9AA6C7';
  c.lineWidth = 5;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(865, 738);
  c.lineTo(865, 716);
  c.moveTo(865, 738);
  c.lineTo(881, 746);
  c.stroke();
  // flag
  c.fillStyle = '#9AA6C7';
  c.fillRect(863, 528, 5, 62);
  c.beginPath();
  c.moveTo(868, 530);
  for (let i = 0; i <= 10; i++) {
    const fx = 868 + i * 5;
    c.lineTo(fx, 530 + Math.sin(t * 6 - i * 0.6) * 3 * (i / 10));
  }
  for (let i = 10; i >= 0; i--) {
    const fx = 868 + i * 5;
    c.lineTo(fx, 560 + Math.sin(t * 6 - i * 0.6) * 3 * (i / 10));
  }
  c.closePath();
  c.fillStyle = CORAL;
  c.fill();
}

function drawPetals(c: Ctx, t: number, w: World) {
  for (const p of w.petals) {
    const y = ((t * p.sp + p.off) % 1600) - 120;
    const x = p.x + Math.sin(t * 0.9 + p.ph) * p.amp;
    c.save();
    c.translate(x, y);
    c.rotate(p.ph + t * p.rs);
    c.scale(p.sz * Math.max(0.25, Math.abs(Math.cos(t * 2 + p.ph))), p.sz);
    c.beginPath();
    c.ellipse(0, 0, 11, 6, 0, 0, TAU);
    c.fillStyle = p.col;
    c.fill();
    c.restore();
  }
}

function drawBubble(
  c: Ctx, t: number, start: number, cx: number, cy: number,
  text: string, typingUntil = 0, textColor = CORAL,
) {
  const s = pop(t, start, 0.5);
  if (s <= 0) return;
  c.font = `600 40px ${HEAD}`;
  const textW = c.measureText(text).width + 64;
  const typing = t < typingUntil;
  const bw = typing ? 128 : lerp(128, textW, typingUntil ? easeOutCubic(prog(t, typingUntil, typingUntil + 0.22)) : 1);
  const bh = 82;
  const y = cy + Math.sin(t * 2.4) * 5;
  const left = cx - bw / 2;
  const px = left + 30;
  const py = y + bh / 2;
  c.save();
  c.translate(px, py);
  c.scale(s, s);
  c.translate(-px, -py);
  c.save();
  c.shadowColor = 'rgba(40,40,80,0.16)';
  c.shadowBlur = 24;
  c.shadowOffsetY = 8;
  rr(c, left, y - bh / 2, bw, bh, bh / 2);
  c.fillStyle = '#FFFFFF';
  c.fill();
  c.restore();
  tri(c, left + 26, py - 14, left + 66, py - 14, left - 22, py + 36, '#FFFFFF');
  if (typing) {
    for (let i = 0; i < 3; i++) {
      const b = Math.max(0, Math.sin(t * 9 - i * 0.9)) * 8;
      circle(c, cx - 26 + i * 26, y - b, 9, '#B8BED6');
    }
  } else {
    c.globalAlpha *= typingUntil ? prog(t, typingUntil + 0.08, typingUntil + 0.3) : 1;
    c.fillStyle = textColor;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(text, cx, y + 2);
  }
  c.restore();
}

function drawBug(c: Ctx) {
  c.strokeStyle = '#3A3F5C';
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  for (const sy of [-12, 2, 16]) {
    c.moveTo(-18, sy);
    c.lineTo(-34, sy - 6);
    c.moveTo(18, sy);
    c.lineTo(34, sy - 6);
  }
  c.moveTo(-5, -36);
  c.lineTo(-14, -52);
  c.moveTo(5, -36);
  c.lineTo(14, -52);
  c.stroke();
  circle(c, -14, -52, 4, '#3A3F5C');
  circle(c, 14, -52, 4, '#3A3F5C');
  c.beginPath();
  c.ellipse(0, 4, 24, 28, 0, 0, TAU);
  c.fillStyle = '#FF6B6B';
  c.fill();
  c.strokeStyle = '#C94B4B';
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(0, -22);
  c.lineTo(0, 31);
  c.stroke();
  for (const [sx, sy] of [[-10, 0], [10, 0], [-9, 15], [9, 15]] as const) circle(c, sx, sy, 5, '#C94B4B');
  circle(c, 0, -28, 14, '#3A3F5C');
  circle(c, -5, -31, 3.2, '#FFFFFF');
  circle(c, 5, -31, 3.2, '#FFFFFF');
}

function drawCoffee(c: Ctx, t: number) {
  c.lineCap = 'round';
  c.lineWidth = 5;
  c.strokeStyle = 'rgba(217,220,245,0.55)';
  for (let i = 0; i < 3; i++) {
    c.beginPath();
    for (let k = 0; k <= 12; k++) {
      const yy = -64 - k * 5;
      const xx = -16 + i * 16 + Math.sin(t * 4 + k * 0.6 + i) * 5;
      if (k === 0) c.moveTo(xx, yy);
      else c.lineTo(xx, yy);
    }
    c.stroke();
  }
  c.beginPath();
  c.moveTo(-38, -40);
  c.lineTo(38, -40);
  c.lineTo(30, 44);
  c.quadraticCurveTo(30, 50, 24, 50);
  c.lineTo(-24, 50);
  c.quadraticCurveTo(-30, 50, -30, 44);
  c.closePath();
  c.fillStyle = '#F4F1EA';
  c.fill();
  c.beginPath();
  c.moveTo(-35, -8);
  c.lineTo(35, -8);
  c.lineTo(33, 20);
  c.lineTo(-33, 20);
  c.closePath();
  c.fillStyle = '#C9925E';
  c.fill();
  rr(c, -45, -56, 90, 20, 9);
  c.fillStyle = '#E2DBCB';
  c.fill();
}

function drawCap(c: Ctx, tassel: string) {
  c.beginPath();
  c.moveTo(-48, 6);
  c.lineTo(48, 6);
  c.lineTo(40, 44);
  c.quadraticCurveTo(0, 56, -40, 44);
  c.closePath();
  c.fillStyle = '#1E2034';
  c.fill();
  c.beginPath();
  c.moveTo(-88, 0);
  c.lineTo(0, -30);
  c.lineTo(88, 0);
  c.lineTo(0, 30);
  c.closePath();
  c.fillStyle = '#2C2F48';
  c.fill();
  c.beginPath();
  c.moveTo(-88, 0);
  c.lineTo(0, -30);
  c.lineTo(88, 0);
  c.closePath();
  c.fillStyle = '#3A3E5E';
  c.fill();
  c.strokeStyle = tassel;
  c.lineWidth = 4;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(58, 12);
  c.lineTo(58, 50);
  c.stroke();
  rr(c, 51, 46, 14, 28, 5);
  c.fillStyle = tassel;
  c.fill();
  circle(c, 0, 0, 6, tassel);
}

function drawTrophy(c: Ctx) {
  const gold = '#FFC94D';
  c.strokeStyle = gold;
  c.lineWidth = 6;
  c.beginPath();
  c.arc(-28, -16, 13, Math.PI * 0.5, Math.PI * 1.5);
  c.stroke();
  c.beginPath();
  c.arc(28, -16, 13, -Math.PI * 0.5, Math.PI * 0.5);
  c.stroke();
  c.beginPath();
  c.moveTo(-28, -34);
  c.lineTo(28, -34);
  c.quadraticCurveTo(26, 10, 0, 14);
  c.quadraticCurveTo(-26, 10, -28, -34);
  c.fillStyle = gold;
  c.fill();
  c.fillStyle = gold;
  c.fillRect(-6, 12, 12, 14);
  rr(c, -22, 24, 44, 12, 4);
  c.fillStyle = '#E0A92E';
  c.fill();
  c.save();
  c.translate(0, -14);
  drawStar5(c, 9, '#FFFFFF');
  c.restore();
}

function drawConfettoAt(c: Ctx, x: number, y: number, rot: number, flip: number, col: string, w: number, h: number) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(Math.max(0.12, Math.abs(Math.cos(flip))), 1);
  c.fillStyle = col;
  c.fillRect(-w / 2, -h / 2, w, h);
  c.restore();
}

interface Token {
  s: string;
  col: string;
}

function codeCard(c: Ctx, x: number, y: number, w: number, lines: Token[][]) {
  const h = 52 + lines.length * 38;
  c.save();
  c.shadowColor = 'rgba(0,0,0,0.35)';
  c.shadowBlur = 30;
  c.shadowOffsetY = 12;
  rr(c, x, y, w, h, 22);
  c.fillStyle = 'rgba(31,34,70,0.94)';
  c.fill();
  c.restore();
  rr(c, x, y, w, h, 22);
  c.strokeStyle = 'rgba(255,255,255,0.12)';
  c.lineWidth = 2;
  c.stroke();
  ['#FF7A7A', '#FFC861', '#6EE7A8'].forEach((col, i) => circle(c, x + 26 + i * 22, y + 24, 6.5, col));
  c.font = `500 24px ${MONO}`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  lines.forEach((line, li) => {
    let cx = x + 22;
    const cy = y + 78 + li * 38;
    for (const tok of line) {
      c.fillStyle = tok.col;
      c.fillText(tok.s, cx, cy);
      cx += c.measureText(tok.s).width;
    }
  });
}

/* ------------------------------------------------------------------ */
/* Scene 0 — boot                                                      */
/* ------------------------------------------------------------------ */

function scene0(c: Ctx, t: number, w: World) {
  c.fillStyle = NAVY;
  c.fillRect(0, 0, STAGE_W, w.height);
  c.fillStyle = `rgba(255,255,255,${0.055 * prog(t, 0, 0.4)})`;
  for (let y = 27; y < w.height; y += 54) for (let x = 27; x < STAGE_W; x += 54) c.fillRect(x - 2, y - 2, 4, 4);

  const p = easeOutCubic(prog(t, 0.05, 0.45));
  if (p <= 0) return;
  c.save();
  c.globalAlpha = p;
  c.translate(540, 675 + w.extra / 2);
  c.scale(0.94 + 0.06 * p, 0.94 + 0.06 * p);
  c.translate(-540, -675);

  c.save();
  c.shadowColor = 'rgba(0,0,0,0.45)';
  c.shadowBlur = 60;
  c.shadowOffsetY = 24;
  rr(c, 130, 455, 820, 440, 30);
  c.fillStyle = '#232A42';
  c.fill();
  c.restore();
  rr(c, 130, 455, 820, 440, 30);
  c.strokeStyle = 'rgba(255,255,255,0.08)';
  c.lineWidth = 2;
  c.stroke();
  ['#FF7A7A', '#FFC861', '#6EE7A8'].forEach((col, i) => circle(c, 172 + i * 32, 497, 9, col));
  c.font = `500 22px ${MONO}`;
  c.fillStyle = 'rgba(255,255,255,0.4)';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText('~/journey', 540, 498);
  c.fillStyle = 'rgba(255,255,255,0.07)';
  c.fillRect(130, 532, 820, 2);

  const L = 172;
  const user = `${w.T.handle}@campus`;
  const cmd = 'npm run my-journey';
  const size = fitFont(c, (s) => `500 ${s}px ${MONO}`, 31, `${user}:~$ ${cmd}`, 740);
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  let x = L;
  const y1 = 605;
  c.fillStyle = MINT;
  c.fillText(user, x, y1);
  x += c.measureText(user).width;
  c.fillStyle = '#8A91B4';
  c.fillText(':~$ ', x, y1);
  x += c.measureText(':~$ ').width;
  const typed = cmd.slice(0, Math.floor(prog(t, 0.45, 1.15) * cmd.length));
  c.fillStyle = '#F4F6FF';
  c.fillText(typed, x, y1);
  let cur = { x: x + c.measureText(typed).width, y: y1 };

  if (t > 1.25) {
    const l2 = '> loading chapters...';
    c.fillStyle = '#8A91B4';
    c.fillText(l2, L, 668);
    cur = { x: L + c.measureText(l2).width, y: 668 };
  }
  if (t > 1.35) {
    const pp = prog(t, 1.35, 1.85);
    const k = Math.floor(pp * 12);
    for (let i = 0; i < 12; i++) {
      rr(c, L + i * 40, 702, 32, 30, 6);
      c.fillStyle = i < k ? MINT : 'rgba(255,255,255,0.08)';
      c.fill();
    }
    const pct = `${Math.round(pp * 100)}%`;
    c.fillStyle = '#F4F6FF';
    c.fillText(pct, L + 12 * 40 + 14, 728);
    cur = { x: L + 12 * 40 + 14 + c.measureText(pct).width, y: 728 };
  }
  if (t > 1.9) {
    const l4 = '4 chapters ready';
    drawCheck(c, L + 14, 782, 15, MINT, 4.5);
    c.fillStyle = MINT;
    c.fillText(l4, L + 44, 792);
    cur = { x: L + 44 + c.measureText(l4).width, y: 792 };
  }
  if (t < 1.15 || Math.floor(t * 2.5) % 2 === 0) {
    c.fillStyle = '#F4F6FF';
    c.fillRect(cur.x + 8, cur.y - size * 0.82, size * 0.5, size * 1.02);
  }
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Scene 1 — freshman                                                  */
/* ------------------------------------------------------------------ */

function sticker(c: Ctx, t: number, start: number, x: number, y: number, draw: () => void) {
  const s = pop(t, start, 0.5);
  const bob = Math.sin(t * 2.2 + x * 0.05) * 6;
  withPop(c, x, y + bob, s, prog(t, start, start + 0.12), draw);
}

function scene1(c: Ctx, t: number, w: World) {
  vGradient(c, '#FFF7EA', '#FFDFCA', w.height);
  c.save();
  cam(c, prog(t, 2.0, 6.6));
  circle(c, 540, 640 + w.extra * .5, 410, 'rgba(255,236,190,0.55)');
  circle(c, 540, 640 + w.extra * .5, 325, '#FFE7B2');
  drawCloud(c, ((t * 26 + 100) % 1500) - 250, 340, 1.0);
  drawCloud(c, ((t * 18 + 900) % 1500) - 250, 470, 0.72);
  drawCloud(c, ((t * 14 + 520) % 1500) - 250, 250, 0.58);
  c.save(); c.translate(0, w.extra);
  drawCampus(c, t);
  drawTree(c, 92, 1130, 1.15, t);
  drawTree(c, 1012, 1175, 1.0, t + 1.3);
  c.restore();
  const enter = prog(t, 2.45, 3.15);
  drawChar(c, w, w.A.freshman, eyesAt(t, [4.45, 5.8]), t, { dy: (1 - easeOutBack(enter)) * 560 });
  drawPetals(c, t, w);
  c.restore();

  c.save(); c.translate(0, w.extra * .45);
  sticker(c, t, 3.35, 140, 520, () => {
    c.save();
    c.translate(5, 7);
    drawStar5(c, 42, 'rgba(120,70,40,0.12)');
    c.restore();
    c.rotate(Math.sin(t * 1.6) * 0.15);
    drawStar5(c, 42, '#FFD166');
  });
  sticker(c, t, 3.5, 248, 668, () => drawBadge(c, 'A+'));
  sticker(c, t, 3.62, 150, 845, () => drawPencil(c));
  drawBubble(c, t, 3.85, 868, 432, w.T.ch1Bubble);

  c.restore();
  c.save(); c.translate(0, Math.min(w.extra * .2, 160));
  drawChip(c, 'CHAPTER 01', 540, 92, '#FFD9C7', '#C4553A', pop(t, 2.75));
  drawTitle(c, w.words1, 540, 205, 82, INK, CORAL, t, 2.95, 0.12);
  drawSubtitle(c, w.T.ch1Subtitle, 540, 262, 34, '#8B7F8F', t, 3.4);
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Scene 2 — CS life                                                   */
/* ------------------------------------------------------------------ */

const CARD_L: Token[][] = [
  [{ s: 'while', col: '#C792EA' }, { s: ' (!', col: '#E6E9F5' }, { s: 'graduated', col: '#82AAFF' }, { s: ') {', col: '#E6E9F5' }],
  [{ s: '  learn', col: MINT }, { s: '();', col: '#E6E9F5' }],
  [{ s: '  debug', col: '#FFB86B' }, { s: '();', col: '#E6E9F5' }],
  [{ s: '}', col: '#E6E9F5' }],
];
const CARD_R: Token[][] = [
  [{ s: 'git commit -m', col: '#82AAFF' }],
  [{ s: '"all-nighter #42"', col: '#C3E88D' }],
];
const BUGS = [
  { x: 112, y: 905, kill: 8.25 },
  { x: 222, y: 1012, kill: 8.95 },
  { x: 104, y: 1100, kill: 9.62 },
];
const COFFEE_TIMES = [7.6, 8.3, 9.0, 9.7];

function skillProgress(t: number) {
  if (t < 7.45) return 0;
  if (t < 8.7) return 0.62 * easeInOutCubic(prog(t, 7.45, 8.7));
  if (t < 9.3) return 0.62 + 0.25 * easeOutCubic(prog(t, 8.7, 9.3));
  if (t < 9.72) return 0.87;
  return 0.87 + 0.13 * easeOutCubic(prog(t, 9.72, 10.05));
}

function scene2(c: Ctx, t: number, w: World) {
  vGradient(c, '#181B36', '#2B2E5F', w.height);
  c.save();
  cam(c, prog(t, 6.0, 11.0));
  for (const s of w.stars) {
    c.globalAlpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 2.2 + s.ph));
    circle(c, s.x, s.y, s.r, '#FFFFFF');
  }
  c.globalAlpha = 1;
  c.save(); c.translate(0, w.extra * .24);
  const glow = c.createRadialGradient(905, 330, 40, 905, 330, 190);
  glow.addColorStop(0, 'rgba(255,233,168,0.35)');
  glow.addColorStop(1, 'rgba(255,233,168,0)');
  c.fillStyle = glow;
  c.fillRect(700, 130, 400, 400);
  circle(c, 905, 330, 62, '#FFE9A8');
  circle(c, 885, 315, 13, '#F4D98E');
  circle(c, 925, 350, 9, '#F4D98E');
  circle(c, 915, 305, 6, '#F4D98E');
  c.restore();

  c.font = `500 26px ${MONO}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  for (const col of w.rain) {
    for (let j = 0; j < col.chars.length; j++) {
      const y = ((t * col.sp + col.off + j * 40) % 1500) - 80;
      c.globalAlpha = 0.04 + 0.11 * (j / col.chars.length);
      c.fillStyle = MINT;
      c.fillText(col.chars[j] ?? '0', col.x, y);
    }
  }
  c.globalAlpha = 1;
  drawChar(c, w, w.A.cs, eyesAt(t, [8.15, 9.9]), t);
  c.restore();

  c.save(); c.translate(0, w.extra * .5);
  // code cards
  const pl = easeOutCubic(prog(t, 6.9, 7.45));
  if (pl > 0) codeCard(c, lerp(-380, 36, pl), 466 + Math.sin(t * 1.8) * 6, 332, CARD_L);
  const pr = easeOutCubic(prog(t, 7.3, 7.85));
  if (pr > 0) codeCard(c, lerp(1100, 712, pr), 792 + Math.sin(t * 1.8 + 1.5) * 6, 334, CARD_R);

  // coffee + counter
  sticker(c, t, 7.2, 940, 600, () => {
    drawCoffee(c, t);
    let n = 1;
    let bumpAt = 7.2;
    for (const ct of COFFEE_TIMES) if (t >= ct) {
      n += 1;
      bumpAt = ct;
    }
    const bump = 1 + 0.35 * (1 - easeOutCubic(prog(t, bumpAt, bumpAt + 0.3)));
    c.save();
    c.translate(46, -58);
    c.scale(bump, bump);
    circle(c, 0, 0, 27, CORAL);
    c.font = `700 25px ${HEAD}`;
    c.fillStyle = '#FFFFFF';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(`×${n}`, 0, 1);
    c.restore();
  });

  // bugs
  BUGS.forEach((b, i) => {
    const appear = pop(t, 7.65 + i * 0.12, 0.45);
    if (appear <= 0) return;
    if (t < b.kill) {
      withPop(c, b.x + Math.sin(t * 7 + i) * 4, b.y + Math.cos(t * 5 + i) * 3, appear * 0.95, 1, () => {
        c.rotate(Math.sin(t * 6 + i) * 0.25);
        drawBug(c);
      });
      return;
    }
    const q = prog(t, b.kill, b.kill + 0.16);
    if (q < 1) {
      c.save();
      c.globalAlpha = 1 - q;
      c.translate(b.x, b.y);
      c.scale(0.95 * (1 + 0.6 * q), 0.95 * (1 - 0.85 * q));
      drawBug(c);
      c.restore();
    }
    const burst = prog(t, b.kill, b.kill + 0.5);
    if (burst < 1) {
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        const d = 12 + 56 * easeOutCubic(burst);
        c.globalAlpha = 1 - burst;
        circle(c, b.x + Math.cos(a) * d, b.y + Math.sin(a) * d, 7 * (1 - burst) + 1, k % 2 ? MINT : '#FFD166');
      }
      c.globalAlpha = 1;
    }
    const ok = pop(t, b.kill + 0.1, 0.4);
    withPop(c, b.x, b.y, ok * 0.9, 1, () => {
      circle(c, 0, 0, 24, MINT);
      drawCheck(c, 0, 1, 13, '#183A33', 5);
    });
  });

  c.restore();
  // progress card
  const pa = easeOutCubic(prog(t, 7.1, 7.55));
  if (pa > 0) {
    const y = lerp(1420, 1166, pa) + w.extra - Math.min(w.extra * .25, 190);
    const v = skillProgress(t);
    const done = t >= 10.05;
    c.save();
    if (done) {
      c.shadowColor = MINT;
      c.shadowBlur = 36 * (0.6 + 0.4 * Math.sin((t - 10.05) * 10));
    }
    rr(c, 140, y, 800, 134, 28);
    c.fillStyle = 'rgba(19,21,44,0.92)';
    c.fill();
    c.restore();
    rr(c, 140, y, 800, 134, 28);
    c.strokeStyle = done ? MINT : 'rgba(255,255,255,0.12)';
    c.lineWidth = 2;
    c.stroke();
    c.font = `600 26px ${MONO}`;
    c.textBaseline = 'alphabetic';
    c.textAlign = 'left';
    if (done) {
      drawCheck(c, 190, y + 40, 14, MINT, 4.5);
      c.font = `700 26px ${MONO}`;
      c.fillStyle = MINT;
      c.fillText('BUILD SUCCESS', 216, y + 50);
    } else {
      c.fillStyle = '#AEB4DA';
      c.fillText(t >= 9.3 ? 'fixing one last bug...' : 'skills.loading()', 176, y + 50);
    }
    c.textAlign = 'right';
    c.fillStyle = '#FFFFFF';
    c.fillText(`${Math.round(v * 100)}%`, 904, y + 50);
    rr(c, 176, y + 78, 728, 24, 12);
    c.fillStyle = 'rgba(255,255,255,0.08)';
    c.fill();
    if (v > 0.005) {
      const g = c.createLinearGradient(176, 0, 904, 0);
      g.addColorStop(0, MINT);
      g.addColorStop(1, '#A78BFA');
      rr(c, 176, y + 78, 728 * v, 24, 12);
      c.fillStyle = g;
      c.fill();
    }
  }

  c.save(); c.translate(0, Math.min(w.extra * .2, 160));
  drawChip(c, 'CHAPTER 02', 540, 92, 'rgba(124,240,197,0.16)', MINT, pop(t, 6.75));
  drawTitle(c, w.words2, 540, 205, 82, '#FFFFFF', MINT, t, 6.9, 0.12);
  drawSubtitle(c, w.T.ch2Subtitle, 540, 262, 34, '#AEB4DA', t, 7.3);
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Scene 3 — graduation                                                */
/* ------------------------------------------------------------------ */

const CAPS = [
  { x: 170, t: 11.25, vx: -150, spin: -5, tassel: '#FFC94D', s: 1.0 },
  { x: 330, t: 11.36, vx: -95, spin: 6, tassel: '#5B8DEF', s: 1.15 },
  { x: 750, t: 11.44, vx: 95, spin: -6.5, tassel: '#FFC94D', s: 1.1 },
  { x: 910, t: 11.55, vx: 150, spin: 5.5, tassel: '#5B8DEF', s: 0.95 },
];

function drawRibbon(c: Ctx, t: number, text: string, start: number) {
  const p = prog(t, start, start + 0.5);
  if (p <= 0) return;
  const cx = 540;
  const cy = 198;
  const h = 108;
  const full = 720;
  const bw = full * easeOutBack(p);
  const tp = easeOutCubic(prog(t, start + 0.15, start + 0.55));
  if (tp > 0) {
    for (const side of [-1, 1]) {
      const x0 = cx + side * (bw / 2 - 34);
      c.beginPath();
      c.moveTo(x0, cy - h / 2 + 26);
      c.lineTo(x0 + side * 120 * tp, cy - h / 2 + 26);
      c.lineTo(x0 + side * 86 * tp, cy + 26);
      c.lineTo(x0 + side * 120 * tp, cy + h / 2 + 26);
      c.lineTo(x0, cy + h / 2 + 26);
      c.closePath();
      c.fillStyle = '#C94F45';
      c.fill();
      tri(c, cx + side * (bw / 2), cy + h / 2, cx + side * (bw / 2 - 34), cy + h / 2, cx + side * (bw / 2 - 34), cy + h / 2 + 26, '#A33E37');
    }
  }
  c.save();
  c.shadowColor = 'rgba(150,60,30,0.25)';
  c.shadowBlur = 20;
  c.shadowOffsetY = 8;
  rr(c, cx - bw / 2, cy - h / 2, bw, h, 10);
  c.fillStyle = CORAL;
  c.fill();
  c.restore();
  c.save();
  c.strokeStyle = 'rgba(255,255,255,0.4)';
  c.lineWidth = 3;
  c.setLineDash([14, 10]);
  c.beginPath();
  c.moveTo(cx - bw / 2 + 18, cy - h / 2 + 12);
  c.lineTo(cx + bw / 2 - 18, cy - h / 2 + 12);
  c.moveTo(cx - bw / 2 + 18, cy + h / 2 - 12);
  c.lineTo(cx + bw / 2 - 18, cy + h / 2 - 12);
  c.stroke();
  c.restore();
  const ts = pop(t, start + 0.28, 0.45);
  withPop(c, cx, cy, ts, ts * 3, () => {
    fitFont(c, (s) => `700 ${s}px ${HEAD}`, 76, text, full - 90);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = '#B4473E';
    c.fillText(text, 0, 7);
    c.fillStyle = '#FFFFFF';
    c.fillText(text, 0, 2);
  });
}

function scene3(c: Ctx, t: number, w: World) {
  const bg = c.createRadialGradient(540, 560, 60, 540, 560, 1000);
  bg.addColorStop(0, '#FFF1C4');
  bg.addColorStop(1, '#FFBE78');
  c.fillStyle = bg;
  c.fillRect(0, 0, STAGE_W, w.height);

  c.save();
  cam(c, prog(t, 10.8, 15.3), 0.05);
  c.save();
  c.translate(540, 560 + w.extra * .4);
  c.rotate(t * 0.12);
  c.fillStyle = 'rgba(255,255,255,0.2)';
  for (let i = 0; i < 18; i++) {
    const a = (i * TAU) / 18;
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, 1500, a - TAU / 72, a + TAU / 72);
    c.closePath();
    c.fill();
  }
  c.restore();
  for (const s of w.sparks) {
    const k = Math.max(0, Math.sin(t * 2.6 + s.ph));
    drawSparkle(c, s.x, s.y, s.s * k, 'rgba(255,255,255,0.95)');
  }
  const settle = 1 + 0.07 * (1 - easeOutCubic(prog(t, 10.85, 11.35)));
  drawChar(c, w, w.A.grad, eyesAt(t, [13.75], [10.85, 12.55]), t, { scale: settle });
  c.restore();

  // caps
  for (const cap of CAPS) {
    const tau = t - cap.t;
    if (tau < 0 || tau > 2.4) continue;
    const y = 1420 - 2900 * tau + 1300 * tau * tau;
    const x = cap.x + cap.vx * tau;
    c.save();
    c.translate(x, y);
    c.rotate(cap.spin * tau);
    c.scale(cap.s, cap.s);
    drawCap(c, cap.tassel);
    c.restore();
  }

  // confetti cannons (closed-form linear drag)
  const k = 3;
  const g = 700;
  for (const p of w.burst) {
    const tau = t - p.t0;
    if (tau <= 0) continue;
    const e = 1 - Math.exp(-k * tau);
    const y = 1260 + (g / k) * tau + (p.vy - g / k) * (e / k);
    if (y > 1460) continue;
    const x0 = p.side < 0 ? -10 : STAGE_W + 10;
    const x = x0 - p.side * p.vx * (e / k) + Math.sin(tau * p.fl + p.ph) * 14 * Math.min(1, tau);
    drawConfettoAt(c, x, y, p.ph + p.spin * tau, p.ph + p.flip * tau, p.col, p.w, p.h);
  }
  for (const d of w.drizzle) {
    const tau = t - d.t0;
    if (tau <= 0) continue;
    const y = -40 + 240 * tau;
    if (y > 1420) continue;
    drawConfettoAt(c, d.x + Math.sin(tau * 2.2 + d.ph) * 30, y, d.ph + d.spin * tau, d.ph + d.flip * tau, d.col, d.w, d.h);
  }

  c.save(); c.translate(0, Math.min(w.extra * .2, 160));
  drawChip(c, 'CHAPTER 03', 540, 84, 'rgba(255,255,255,0.62)', '#B5651D', pop(t, 11.0));
  drawRibbon(c, t, w.T.ch3Title, 11.1);
  drawSubtitle(c, w.T.ch3Subtitle, 540, 306, 34, '#8A4B1F', t, 11.7);
  c.restore();

  // achievement toast
  const ap = prog(t, 12.35, 12.85);
  if (ap > 0) {
    const y = lerp(1430, 1160, easeOutBack(ap)) + w.extra - Math.min(w.extra * .25, 190);
    c.save();
    c.shadowColor = 'rgba(80,40,10,0.3)';
    c.shadowBlur = 34;
    c.shadowOffsetY = 14;
    rr(c, 160, y, 760, 134, 30);
    c.fillStyle = '#2B2140';
    c.fill();
    c.restore();
    c.save();
    c.translate(236, y + 70);
    drawTrophy(c);
    c.restore();
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.font = `700 21px ${MONO}`;
    c.fillStyle = '#FFC94D';
    c.fillText('ACHIEVEMENT UNLOCKED', 302, y + 54);
    fitFont(c, (s) => `600 ${s}px ${HEAD}`, 42, w.T.ch3Achievement, 580);
    c.fillStyle = '#FFFFFF';
    c.fillText(w.T.ch3Achievement, 302, y + 102);
    const sp = prog(t, 12.95, 13.6);
    if (sp > 0 && sp < 1) {
      c.save();
      rr(c, 160, y, 760, 134, 30);
      c.clip();
      const sx = lerp(80, 1000, easeInOutCubic(sp));
      c.beginPath();
      c.moveTo(sx, y);
      c.lineTo(sx + 70, y);
      c.lineTo(sx + 20, y + 134);
      c.lineTo(sx - 50, y + 134);
      c.closePath();
      c.fillStyle = 'rgba(255,255,255,0.22)';
      c.fill();
      c.restore();
    }
  }
}

/* ------------------------------------------------------------------ */
/* Scene 4 — developer                                                 */
/* ------------------------------------------------------------------ */

function scene4(c: Ctx, t: number, w: World) {
  vGradient(c, '#F2F6FF', '#D7E1F5', w.height);
  c.save();
  cam(c, prog(t, 14.6, 19.0));
  circle(c, 540, 620, 370, 'rgba(255,255,255,0.65)');
  c.fillStyle = '#C8D4EC';
  for (const b of w.skyBack) c.fillRect(b.x, w.height - b.h - 120, b.w, b.h + 120);
  for (const b of w.skyFront) {
    const top = w.height - b.h;
    c.fillStyle = '#B2C3E3';
    c.fillRect(b.x, top, b.w, b.h);
    const cols = Math.max(1, Math.floor((b.w - 24) / 34));
    const rows = Math.max(1, Math.floor((b.h - 40) / 44));
    const ox = b.x + (b.w - cols * 34 + 14) / 2;
    for (let r = 0; r < rows; r++) {
      for (let q = 0; q < cols; q++) {
        const ph = b.lit[r * cols + q] ?? 0;
        if (ph) {
          c.fillStyle = `rgba(255,227,155,${0.65 + 0.35 * Math.sin(t * 1.7 + ph)})`;
        } else {
          c.fillStyle = 'rgba(255,255,255,0.32)';
        }
        c.fillRect(ox + q * 34, top + 26 + r * 44, 20, 24);
      }
    }
  }
  const settle = 1 + 0.05 * (1 - easeOutCubic(prog(t, 14.75, 15.5)));
  drawChar(c, w, w.A.work, eyesAt(t, [16.7, 18.05]), t, { scale: settle });
  c.restore();

  c.save(); c.translate(0, w.extra * .48);
  // browser card
  sticker(c, t, 15.55, 190, 590, () => {
    c.save();
    c.shadowColor = 'rgba(60,80,140,0.2)';
    c.shadowBlur = 30;
    c.shadowOffsetY = 12;
    rr(c, -150, -110, 300, 220, 22);
    c.fillStyle = '#FFFFFF';
    c.fill();
    c.restore();
    c.save();
    rr(c, -150, -110, 300, 220, 22);
    c.clip();
    c.fillStyle = '#EEF2FB';
    c.fillRect(-150, -110, 300, 42);
    c.restore();
    ['#FF7A7A', '#FFC861', '#6EE7A8'].forEach((col, i) => circle(c, -124 + i * 22, -89, 6.5, col));
    c.font = `700 62px ${HEAD}`;
    c.fillStyle = VIOLET;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('</>', 0, -12);
    rr(c, -110, 44, 220, 14, 7);
    c.fillStyle = '#E3E8F4';
    c.fill();
    rr(c, -110, 70, 140, 14, 7);
    c.fill();
  });

  drawBubble(c, t, 15.8, 868, 440, w.T.ch4Bubble, 16.25, VIOLET);

  // status pill
  sticker(c, t, 16.6, 918, 900, () => {
    c.font = `600 24px ${MONO}`;
    const pw = c.measureText(w.T.ch4Status).width + 86;
    c.save();
    c.shadowColor = 'rgba(60,80,140,0.18)';
    c.shadowBlur = 24;
    c.shadowOffsetY = 10;
    rr(c, -pw / 2, -38, pw, 76, 38);
    c.fillStyle = '#FFFFFF';
    c.fill();
    c.restore();
    const ring = (t * 1.2) % 1;
    c.globalAlpha = 1 - ring;
    circle(c, -pw / 2 + 38, 0, 10 + ring * 14, 'rgba(46,204,143,0.35)');
    c.globalAlpha = 1;
    circle(c, -pw / 2 + 38, 0, 10, '#2ECC8F');
    c.fillStyle = '#3B4566';
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillText(w.T.ch4Status, -pw / 2 + 62, 1);
  });

  // skill tags
  const tagDots = ['#61DAFB', '#3178C6', '#F7B32B'];
  w.T.skills.slice(0, 3).forEach((skill, i) => {
    sticker(c, t, 16.95 + i * 0.15, 150 + (i % 2) * 46, 900 + i * 92, () => {
      c.font = `600 26px ${MONO}`;
      const pw = c.measureText(skill).width + 74;
      c.save();
      c.shadowColor = 'rgba(60,80,140,0.18)';
      c.shadowBlur = 22;
      c.shadowOffsetY = 8;
      rr(c, -pw / 2, -34, pw, 68, 34);
      c.fillStyle = '#FFFFFF';
      c.fill();
      c.restore();
      circle(c, -pw / 2 + 34, 0, 9, tagDots[i] ?? VIOLET);
      c.fillStyle = '#3B4566';
      c.textAlign = 'left';
      c.textBaseline = 'middle';
      c.fillText(skill, -pw / 2 + 54, 1);
    });
  });

  c.restore();
  c.save(); c.translate(0, Math.min(w.extra * .2, 160));
  drawChip(c, 'CHAPTER 04 · NOW', 540, 92, 'rgba(108,92,231,0.12)', VIOLET, pop(t, 15.25));
  drawTitle(c, w.words4, 540, 205, 84, INK, VIOLET, t, 15.4, 0.14);

  // typed role
  if (t > 16.0) {
    const size = fitFont(c, (s) => `600 ${s}px ${MONO}`, 36, w.T.role, STAGE_W - 200);
    const full = c.measureText(w.T.role).width;
    const n = Math.floor(prog(t, 16.0, 16.85) * w.T.role.length);
    const shown = w.T.role.slice(0, n);
    const x0 = 540 - full / 2;
    c.textAlign = 'left';
    c.textBaseline = 'alphabetic';
    c.fillStyle = '#4A5275';
    c.fillText(shown, x0, 266);
    if (Math.floor(t * 2.5) % 2 === 0 || n < w.T.role.length) {
      c.fillStyle = VIOLET;
      c.fillRect(x0 + c.measureText(shown).width + 6, 266 - size * 0.8, size * 0.45, size);
    }
  }
  c.restore();
}

/* ------------------------------------------------------------------ */
/* Transitions & controller                                            */
/* ------------------------------------------------------------------ */

function iris(c: Ctx, p: number, cx: number, cy: number, ring: string, draw: () => void) {
  const e = easeInOutCubic(p);
  const R = Math.max(1150, c.canvas.height / c.getTransform().a) * e;
  if (R <= 0.5) return;
  c.save();
  c.beginPath();
  c.arc(cx, cy, R, 0, TAU);
  c.clip();
  draw();
  c.restore();
  if (p < 1) {
    c.save();
    c.globalAlpha = 1 - e * 0.7;
    c.strokeStyle = ring;
    c.lineWidth = 14;
    c.beginPath();
    c.arc(cx, cy, R, 0, TAU);
    c.stroke();
    c.restore();
  }
}

function overlay(c: Ctx, color: string, a: number, height = STAGE_H) {
  if (a <= 0) return;
  c.save();
  c.globalAlpha = clamp01(a);
  c.fillStyle = color;
  c.fillRect(0, 0, STAGE_W, height);
  c.restore();
}

function makeGrain(): HTMLCanvasElement {
  const g = document.createElement('canvas');
  g.width = 180;
  g.height = 180;
  const gc = g.getContext('2d');
  if (!gc) return g;
  const img = gc.createImageData(180, 180);
  const r = mulberry32(99);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (r() - 0.5) * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  gc.putImageData(img, 0, 0);
  return g;
}

export function createStory(
  canvas: HTMLCanvasElement,
  assets: StoryAssets,
  text: Partial<StoryText> = {},
  options: { duration?: number; onComplete?: () => void; onChapter?: (chapter: number) => void } = {},
): StoryController {
  const display = canvas;
  const output = display.getContext('2d');
  if (!output) throw new Error('Canvas 2D is not supported in this browser.');
  canvas = document.createElement('canvas');
  const maybe = canvas.getContext('2d');
  if (!maybe) throw new Error('Canvas 2D is not supported in this browser.');
  const ctx: Ctx = maybe;
  const w = buildWorld(assets, { ...defaultStoryText, ...text });

  const tiny = document.createElement('canvas');
  const tctx = tiny.getContext('2d') as Ctx;
  const grain = ctx.createPattern(makeGrain(), 'repeat');

  let scale = 1;
  let raf = 0;
  let playing = false;
  let origin = 0;
  let current = 0;
  let lastChapter = -2;

  function glitch(t: number) {
    const p = prog(t, 6.0, 6.6);
    const amt = Math.sin(Math.PI * p);
    const cw = canvas.width;
    const ch = canvas.height;
    const block = Math.max(1, 1 + amt * cw * 0.032);
    const tw = Math.max(1, Math.round(cw / block));
    const th = Math.max(1, Math.round(ch / block));
    // Render the scene straight into a low-res canvas, then blow it up unsmoothed.
    tctx.setTransform(tw / STAGE_W, 0, 0, th / w.height, 0, 0);
    if (p < 0.5) scene1(tctx, t, w);
    else scene2(tctx, t, w);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tiny, 0, 0, tw, th, 0, 0, cw, ch);
    const r = mulberry32(Math.floor(t * 40) + 7);
    const bands = Math.round(7 * amt);
    for (let i = 0; i < bands; i++) {
      const y = r() * ch;
      const h = (0.015 + r() * 0.07) * ch;
      const dx = (r() - 0.5) * 0.16 * cw * amt;
      ctx.drawImage(tiny, 0, (y / ch) * th, tw, Math.max(1, (h / ch) * th), dx, y, cw, h);
    }
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = amt;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i % 2 ? 'rgba(124,240,197,0.55)' : 'rgba(255,92,170,0.5)';
      ctx.fillRect(0, r() * ch, cw, (0.004 + r() * 0.012) * ch);
    }
    ctx.restore();
  }

  function present(t: number) {
    if (!output) return;
    const width = display.width;
    const height = display.height;
    // Extend the scene's own palette into the viewport, keeping the artwork undistorted.
    const colors = t < 2.6 ? ['#171B2E', '#171B2E']
      : t < 6.6 ? ['#FFF8EC', '#FFE2CA']
      : t < 10.85 ? ['#171B2E', '#2B2D59']
      : t < 15.35 ? ['#FFE8B6', '#FFD38A']
      : ['#F3F6FF', '#DBE5FA'];
    const background = output.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, colors[0]!);
    background.addColorStop(1, colors[1]!);
    output.fillStyle = background;
    output.fillRect(0, 0, width, height);
    const fit = Math.min(width / canvas.width, height / canvas.height);
    const dw = canvas.width * fit;
    const dh = canvas.height * fit;
    output.drawImage(canvas, (width - dw) / 2, (height - dh) / 2, dw, dh);
  }

  function renderAt(tRaw: number) {
    const t = ((tRaw % DURATION) + DURATION) % DURATION;
    current = t;
    const chapter = t < 2.6 ? -1 : t < 6.6 ? 0 : t < 10.85 ? 1 : t < 15.35 ? 2 : 3;
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      options.onChapter?.(chapter);
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if (t < 2.0) scene0(ctx, t, w);
    else if (t < 2.6) {
      scene0(ctx, t, w);
      iris(ctx, prog(t, 2.0, 2.6), 540, 760, MINT, () => scene1(ctx, t, w));
    } else if (t < 6.0) scene1(ctx, t, w);
    else if (t < 6.6) glitch(t);
    else if (t < 10.85) {
      scene2(ctx, t, w);
      overlay(ctx, '#FFFFFF', prog(t, 10.55, 10.85), w.height);
    } else if (t < 14.7) {
      scene3(ctx, t, w);
      overlay(ctx, '#FFFFFF', 1 - prog(t, 10.85, 11.4), w.height);
    } else if (t < 15.35) {
      scene3(ctx, t, w);
      iris(ctx, prog(t, 14.7, 15.35), 540, 700, '#FFFFFF', () => scene4(ctx, t, w));
    } else {
      scene4(ctx, t, w);
      overlay(ctx, NAVY, prog(t, 18.35, 19.0), w.height);
    }
    if (grain) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = grain;
      ctx.fillRect(0, 0, STAGE_W, w.height);
      ctx.restore();
    }
    present(t);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const viewW = display.clientWidth || STAGE_W / 2;
    const viewH = display.clientHeight || viewW * STAGE_H / STAGE_W;
    display.width = Math.round(viewW * dpr);
    display.height = Math.round(viewH * dpr);
    const portrait = viewH / viewW > 1.4;
    w.height = portrait ? Math.min(2500, STAGE_W * viewH / viewW) : STAGE_H;
    w.extra = w.height - STAGE_H;
    const cssW = Math.min(viewW, viewH * STAGE_W / w.height);
    const pw = Math.max(1, Math.round(cssW * dpr));
    const ph = Math.round((pw * w.height) / STAGE_W);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
      tiny.width = pw;
      tiny.height = ph;
    }
    scale = pw / STAGE_W;
    if (!playing) renderAt(current);
  }

  const speed = DURATION / (options.duration ?? DURATION);
  function frame(now: number) {
    const elapsed = ((now - origin) / 1000) * speed;
    if (options.onComplete && elapsed >= DURATION) {
      pause();
      options.onComplete();
      return;
    }
    renderAt(elapsed);
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (playing) return;
    playing = true;
    origin = performance.now() - (current / speed) * 1000;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    playing = false;
    cancelAnimationFrame(raf);
  }

  resize();

  return {
    play,
    pause,
    isPlaying: () => playing,
    time: () => current,
    renderAt,
    resize,
    destroy: pause,
  };
}

/* ------------------------------------------------------------------ */
/* Loading helpers                                                     */
/* ------------------------------------------------------------------ */

export function loadStoryAssets(urls: StoryAssetUrls): Promise<StoryAssets> {
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  const keys = Object.keys(urls) as (keyof StoryAssets)[];
  return Promise.all(keys.map((k) => load(urls[k]))).then((imgs) => {
    const out = {} as StoryAssets;
    keys.forEach((k, i) => {
      out[k] = imgs[i] as HTMLImageElement;
    });
    return out;
  });
}

export const STORY_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap';

/** Adds the Google Fonts stylesheet (once) and waits for the faces, with a timeout. */
export async function loadStoryFonts(timeoutMs = 3000): Promise<void> {
  if (typeof document === 'undefined') return;
  let link = document.querySelector<HTMLLinkElement>(`link[href="${STORY_FONTS_HREF}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STORY_FONTS_HREF;
    document.head.appendChild(link);
  }
  const el = link;
  const sheetReady = new Promise<void>((resolve) => {
    if (el.sheet) resolve();
    el.addEventListener('load', () => resolve(), { once: true });
    el.addEventListener('error', () => resolve(), { once: true });
  });
  const faces = sheetReady.then(() =>
    Promise.all(
      ['500', '600', '700'].flatMap((wt) => [
        document.fonts.load(`${wt} 40px "Fredoka"`),
        document.fonts.load(`${wt} 30px "JetBrains Mono"`),
      ]),
    ).then(() => undefined),
  );
  await Promise.race([faces, new Promise<void>((r) => setTimeout(r, timeoutMs))]);
}

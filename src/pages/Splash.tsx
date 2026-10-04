import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import freshman from "../assets/images/story-freshman.webp";
import cs from "../assets/images/story-cs.webp";
import grad from "../assets/images/story-grad.webp";
import work from "../assets/images/story-work.webp";

const chapters = [
  { image: freshman, theme: "campus", title: "Every story starts", accent: "somewhere.", subtitle: "My first chapter at Kasetsart University.", label: "01 / THE BEGINNING", note: "Day one!", tag: "A curious freshman", code: "hello, university!" },
  { image: cs, theme: "code", title: "A little curiosity.", accent: "A lot of code.", subtitle: "Computer Science. Learning, trying, trying again.", label: "02 / FINDING MY THING", note: "One more try!", tag: "Computer Science", code: "while (curious) { learn(); }" },
  { image: grad, theme: "graduation", title: "Small steps.", accent: "A big moment.", subtitle: "A Computer Science degree. A new beginning.", label: "03 / A MILESTONE", note: "Made it!", tag: "Achievement unlocked", code: "✓ Bachelor's degree" },
  { image: work, theme: "developer", title: "Hi, I’m", accent: "Korrakot.", subtitle: "Software engineer. Still curious. Always building.", label: "04 / THE NEXT CHAPTER", note: "Let's build!", tag: "React · TypeScript · Java", code: "npm run next-chapter" },
];
import portraitUrl from "../assets/images/korrakot.webp";

export default function Splash() {
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(-1);
  const scene = chapters[Math.max(0, chapter)]!;
  const [ready, setReady] = useState(false);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const enter = useCallback(() => {
    void navigate("/home", { replace: true });
  }, [navigate]);
  useEffect(() => {
    if (reducedMotion) {
      enter();
      return;
    }
    // A hard deadline also covers slow or failed image requests.
    const timers = [2000, 5000, 8000, 11000].map((delay, index) =>
      window.setTimeout(() => setChapter(index), delay),
    );
    const timer = window.setTimeout(enter, 15000);
    return () => { window.clearTimeout(timer); timers.forEach(window.clearTimeout); };
  }, [enter, reducedMotion]);
  useEffect(() => {
    if (!ready || reducedMotion) return;
    for (const next of chapters.slice(1)) { const image = new Image(); image.src = next.image; }
    const portrait = new Image();
    portrait.fetchPriority = "low";
    portrait.src = portraitUrl;
  }, [ready, reducedMotion]);
  return (
    <main
      className={`splash intro-screen career-story story-${chapter < 0 ? "boot" : scene.theme}`}
      aria-label="Welcome to Korrakot's portfolio"
    >
      <header className="intro-header">
        <span className="wordmark">&lt; Korrakot /&gt;</span>
        <Link className="intro-skip" to="/home" replace>
          Skip intro <ArrowRight size={15} />
        </Link>
      </header>
      {chapter < 0 && <div className="story-terminal" aria-label="Starting career story">
        <div className="terminal-bar"><span /><span /><span /><small>korrakot — my journey</small></div>
        <div className="terminal-body"><p><span className="terminal-prompt">➜</span> ~/my-life</p><div className="terminal-command">npm run my-journey</div><p className="terminal-output">A little curiosity. A new adventure.</p></div>
      </div>}
      <div className="intro-art" key={scene.theme} style={chapter < 0 ? {display: "none"} : undefined}>
        <div className="story-orbit" aria-hidden="true" />
        <span className="story-tag">{scene.tag}</span>
        <span className="story-code" aria-hidden="true">{scene.code}</span>
        <div className="story-confetti" aria-hidden="true">{Array.from({length: 12}, (_, i) => <i key={i} style={{left: `${8 + i * 7}%`, animationDelay: `${i * .09}s`}} />)}</div>
        <Sparkles className="intro-spark" aria-hidden="true" />
        {!reducedMotion && (
          <img
            src={scene.image}
            alt="Korrakot's original animated student illustration"
            width="720"
            height="1018"
            fetchPriority="high"
            onLoad={() => setReady(true)}
            onError={enter}
          />
        )}
        <span className="intro-note" aria-hidden="true">
          {scene.note} <span>↗</span>
        </span>
      </div>
      <div className="intro-copy" style={chapter < 0 ? {display: "none"} : undefined}>
        <p className="eyebrow">{scene.label}</p>
        <h1>
          {scene.title}<br /><em>{scene.accent}</em>
        </h1>
        <p className="intro-welcome">{scene.subtitle}</p>
        <div className="story-chapters" aria-label={`Chapter ${chapter + 1} of 4`}>
          {chapters.map((item, index) => <span key={item.theme} className={index <= chapter ? "active" : ""}>{["Campus", "CS life", "Graduation", "Developer"][index]}</span>)}
        </div>
        <div className="intro-progress" aria-hidden="true">
          <span />
        </div>
        <div className="intro-footnote">
          <span>KORRAKOT TRIWICHIAN</span>
          <span>INTRO · 15 SEC</span>
        </div>
      </div>
    </main>
  );
}

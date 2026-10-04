import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpen, Code2, Heart, Pause, PencilLine, Play, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Modal } from "./Modal";
import { images } from "../lib/images";

const stories = {
  home: { image: "korrakot.GIF", title: "Hello, little world", lines: ["Hello, world!", "A little curiosity…", "Let's build something."], tokens: ["hello()", "what if?", "let's go!" ] },
  education: { image: "education.svg", title: "One little milestone", lines: ["It started with a question…", "Then came a lot of learning.", "Still curious. Always learning."], tokens: ["Chapter 01", "One more lesson", "Achievement unlocked"] },
  experience: { image: "experience.svg", title: "Notes from my journey", lines: ["An idea on the board…", "A challenge to figure out.", "A little better, every day."], tokens: ["A fresh idea", "Try. Learn. Repeat.", "Keep growing"] },
  projects: { image: "projects_image.svg", title: "An idea comes to life", lines: ["What if we made this?", "Sketch. Code. Try again.", "An idea becomes real."], tokens: ["What if…", "npm run build", "Made with curiosity"] },
  community: { image: "projects_image.svg", title: "Better together", lines: ["One idea, shared.", "A few more helping hands.", "Better, together."], tokens: ["git init", "Let's collaborate", "Thank you!"] },
  personal: { image: "blogs_image.svg", title: "Beyond the keyboard", lines: ["Away from the keyboard…", "A sketch. A tiny companion.", "A little more me."], tokens: ["Take a little break", "Hello, tiny friend", "Made with love"] },
  contact: { image: "address_image.svg", title: "Me, illustrated", lines: ["A sketch of myself…", "A little personality on a badge.", "Nice to meet you!"], tokens: ["Drawn by me", "Software engineer", "Let's say hello"] },
};
export type IllustrationStoryKind = keyof typeof stories;

function StoryPlayer({ kind, onClose }: { kind: IllustrationStoryKind; onClose: () => void }) {
  const story = stories[kind];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [take, setTake] = useState(0);
  useEffect(() => {
    if (!playing || step === 2) return;
    const timer = window.setTimeout(() => setStep(value => value + 1), 2400);
    return () => window.clearTimeout(timer);
  }, [playing, step, take]);
  const Icon = step === 0 ? PencilLine : step === 1 ? (kind === "education" ? BookOpen : Code2) : (kind === "education" ? Trophy : Heart);
  return <Modal title={story.title} onClose={onClose}>
    <div className={`mini-story mini-story-${kind} mini-story-step-${step}`}>
      <div className="mini-story-stage" key={`${step}-${take}`}>
        <div className="mini-story-halo" />
        <Sparkles className="mini-story-star star-a" /><Sparkles className="mini-story-star star-b" />
        <span className="mini-story-token"><Icon size={17} />{story.tokens[step]}</span>
        <img src={images[story.image]} alt={`Korrakot's ${kind} illustration`} />
        {step === 2 && <div className="mini-story-celebrate" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} style={{left:`${i*10}%`,animationDelay:`${i*.07}s`}} />)}</div>}
      </div>
      <div className="mini-story-caption" key={`${take}-${step}`}>
        <span className="eyebrow">A LITTLE STORY · 0{step + 1} / 03</span>
        <h3 aria-live="polite">{story.lines[step]}</h3>
      </div>
      <div className="mini-story-controls">
        <button className="button secondary" onClick={() => { setStep(0); setTake(value=>value+1); }} aria-label="Restart illustration story"><RotateCcw size={16} />Replay</button>
        {step < 2 ? <>
          <button className="icon-button" onClick={()=>setPlaying(!playing)} aria-label={playing ? "Pause story" : "Play story"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <button className="button primary" onClick={()=>setStep(step+1)}>Next <ArrowRight size={16} /></button>
        </> : <button className="button primary" onClick={onClose}>Back to the page <ArrowRight size={16} /></button>}
      </div>
    </div>
  </Modal>;
}

export function IllustrationStory({ kind }: { kind: IllustrationStoryKind }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className={`illustration-story tale-${kind}`}>
      <button type="button" className="story-replay" onClick={() => setOpen(true)} aria-label={`Play ${kind} illustration story`}><Play size={13} /> Play my story</button>
    </div>
    {open && createPortal(<StoryPlayer kind={kind} onClose={()=>setOpen(false)} />, document.body)}
  </>;
}

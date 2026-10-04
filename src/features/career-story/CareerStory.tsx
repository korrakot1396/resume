import { useEffect, useRef, useState } from 'react';
import { createStory, loadStoryAssets, loadStoryFonts, type StoryController, type StoryText } from './storyEngine';
import freshman from './assets/freshman.webp';
import cs from './assets/cs.webp';
import grad from './assets/grad.webp';
import work from './assets/work.webp';
import eyesBlink from './assets/eyes_blink.webp';
import eyesHappy from './assets/eyes_happy.webp';
import './career-story.css';

const chapterNotes = [
  { word: 'BEGIN.', caption: 'Every big adventure starts with a little curiosity.', note: 'A new campus. A notebook full of possibilities.', code: 'const curiosity = true;' },
  { word: 'LEARN.', caption: 'One bug. One coffee. One small breakthrough.', note: 'The best part of learning? That moment it finally works.', code: 'while (curious) learn();' },
  { word: 'GROW.', caption: 'A thousand little steps. One unforgettable day.', note: 'A degree in Computer Science. A new chapter ahead.', code: 'achievement.unlock();' },
  { word: 'BUILD.', caption: 'Still curious. Now turning ideas into things.', note: 'Thoughtful interfaces. Useful software. A little personality.', code: 'git checkout next-chapter' },
];

type CareerStoryProps = {
  text?: Partial<StoryText>;
  className?: string;
  duration?: number;
  onComplete?: () => void;
  onError?: () => void;
};

export function CareerStory({ text, className = '', duration = 19, onComplete, onError }: CareerStoryProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controller = useRef<StoryController | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const wantPlay = useRef(true);
  const callbacks = useRef({ onComplete, onError });
  useEffect(() => { callbacks.current = { onComplete, onError }; }, [onComplete, onError]);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(-1);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const textKey = JSON.stringify(text ?? {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let cancelled = false;
    let visible = true;
    let story: StoryController | undefined;
    let resize: ResizeObserver | undefined;
    let observer: IntersectionObserver | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (!story || cancelled) return;
      if (wantPlay.current && visible && !document.hidden) story.play();
      else story.pause();
      setPlaying(story.isPlaying());
    };
    const reduce = () => {
      if (motion.matches) {
        wantPlay.current = false;
        story?.pause();
        story?.renderAt(17.8);
        sync();
      }
    };
    syncRef.current = sync;
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', reduce);
    setReady(false);
    setFailed(false);
    // An unavailable asset must never trap the visitor behind the intro.
    const deadline = window.setTimeout(() => {
      cancelled = true;
      setFailed(true);
      callbacks.current.onError?.();
    }, 10000);
    void Promise.all([
      loadStoryAssets({ freshman, cs, grad, work, eyesBlink, eyesHappy }),
      loadStoryFonts(),
    ]).then(([assets]) => {
      if (cancelled) return;
      window.clearTimeout(deadline);
      story = createStory(canvas, assets, JSON.parse(textKey) as Partial<StoryText>, {
        duration,
        onChapter: setChapter,
        onComplete: callbacks.current.onComplete ? () => callbacks.current.onComplete?.() : undefined,
      });
      controller.current = story;
      wantPlay.current = !motion.matches;
      if (motion.matches) story.renderAt(17.8);
      resize = new ResizeObserver(() => story?.resize());
      resize.observe(wrap);
      observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      });
      observer.observe(wrap);
      setReady(true);
      sync();
    }).catch(() => {
      window.clearTimeout(deadline);
      if (cancelled) return;
      setFailed(true);
      callbacks.current.onError?.();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(deadline);
      resize?.disconnect();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', reduce);
      story?.destroy();
      controller.current = null;
    };
  }, [textKey, duration]);

  return <div ref={wrapRef} className={`canvas-career-story ${className}`}>
    <canvas ref={canvasRef}
      // A canvas scene has no equivalent img URL.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img" aria-label="Korrakot's career story: university, Computer Science, graduation and software development" />
    {ready && chapter >= 0 && <aside className={`canvas-story-notes ${chapter === 1 ? 'is-night' : ''}`} aria-hidden="true" key={chapter}>
      <div className="canvas-story-editorial"><small>MY LITTLE JOURNEY / 0{chapter + 1}</small><strong>{chapterNotes[chapter]!.word}</strong><p>{chapterNotes[chapter]!.caption}</p><span>Illustrated with a little imagination.</span></div>
      <div className="canvas-story-postcard"><span className="canvas-postcard-star">✳</span><small>A NOTE FROM THIS CHAPTER</small><p>{chapterNotes[chapter]!.note}</p><code>{chapterNotes[chapter]!.code}</code><span className="canvas-postcard-sign">Korrakot</span></div>
    </aside>}
    {!ready && <output className="canvas-story-loading">{failed ? 'Story unavailable. You can continue to the portfolio.' : 'Preparing my little story…'}</output>}
    {ready && <nav className="canvas-chapters" aria-label="Story chapters">
      {['Campus', 'Code', 'Graduation', 'Today'].map((label, index) => <button key={label} type="button"
        aria-label={`Jump to ${label} chapter`} aria-current={chapter === index ? 'step' : undefined}
        onClick={() => { const story = controller.current; if (!story) return; story.pause(); story.renderAt([2.75, 6.75, 11.1, 15.45][index]!); syncRef.current(); }}>
        <span>{String(index + 1).padStart(2, '0')}</span>{label}
      </button>)}
    </nav>}
    {ready && <button type="button" className="canvas-story-toggle" aria-label={playing ? 'Pause animation' : 'Play animation'} onClick={() => {
      wantPlay.current = !wantPlay.current;
      syncRef.current();
    }}>{playing ? 'Ⅱ' : '▶'}</button>}
  </div>;
}

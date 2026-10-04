import { BookOpen, Bug, Check, Code2, Coffee, GraduationCap, Rocket, Sparkles, Trophy } from "lucide-react";

type Props = { chapter: number };

/** Decorative scenery stays separate from the story's readable content and clock. */
export function StoryScenery({ chapter }: Props) {
  return <div className={`story-scenery scenery-${chapter}`} aria-hidden="true">
    <div className="scene-halo" />
    {chapter === 0 && <>
      <svg className="campus-building" viewBox="0 0 500 300" fill="none">
        <path d="M45 155h410v145H45z" fill="#c8dbcd" />
        <path d="m15 157 235-97 235 97H15Z" fill="#afc9ba" />
        <path d="M215 65h70v90h-70z" fill="#dce8de" />
        <path d="m202 68 48-43 48 43" fill="#9fbdaf" />
        <circle cx="250" cy="105" r="21" fill="#f7faf3" />
        <path d="M250 90v16l11 7" stroke="#89a698" strokeWidth="4" />
        {[75,145,215,285,355,425].map(x=><path key={x} d={`M${x} 175v125`} stroke="#edf3e9" strokeWidth="19" />)}
      </svg>
      <div className="career-sticker sticker-left"><BookOpen size={25} /><span>Chapter one</span></div>
      <div className="career-sticker sticker-right"><Sparkles size={23} /><span>New beginnings</span></div>
      <div className="scene-petals">{Array.from({length:8},(_,i)=><i key={i} style={{left:`${i*14}%`,animationDelay:`${i*-.4}s`}} />)}</div>
    </>}
    {chapter === 1 && <>
      <div className="scene-code-window"><div className="scene-window-dots">● ● ● <span>hello.ts</span></div><code><span>const</span> journey = () =&gt; &#123;<br />&nbsp; learn();<br />&nbsp; build();<br />&nbsp; <span>return</span> tryAgain();<br />&#125;</code></div>
      <div className="career-sticker sticker-right"><Coffee size={26} /><span>Fuel for ideas</span></div>
      <div className="scene-bug"><Bug size={24} /><span>bug fixed <Check size={12} /></span></div>
      <span className="scene-glyph glyph-one">&#123; &#125;</span><span className="scene-glyph glyph-two">&lt;/&gt;</span>
    </>}
    {chapter === 2 && <>
      <div className="graduation-rays" />
      <GraduationCap className="flying-cap cap-one" size={58} /><GraduationCap className="flying-cap cap-two" size={44} />
      <div className="scene-achievement"><Trophy size={24} /><span><small>ACHIEVEMENT UNLOCKED</small>Computer Science graduate</span></div>
    </>}
    {chapter === 3 && <>
      <div className="scene-skyline">{[40,70,50,90,62,80,45].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div>
      <div className="scene-product"><div className="scene-window-dots">● ● ●</div><Code2 size={32} /><div className="product-lines" /><span>Ideas → experiences</span></div>
      <div className="career-sticker sticker-right"><Rocket size={25} /><span>Always building</span></div>
      <div className="scene-online"><i /> ready for the next chapter</div>
    </>}
  </div>;
}

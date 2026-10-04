import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { CareerStory } from '../features/career-story/CareerStory';

export default function Splash() {
  const navigate = useNavigate();
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const enter = useCallback(() => { void navigate('/home', { replace: true }); }, [navigate]);
  useEffect(() => { if (reducedMotion) enter(); }, [enter, reducedMotion]);
  return <main className="canvas-intro" aria-label="Welcome to Korrakot's portfolio">
    <header className="canvas-intro-header">
      <span className="wordmark">&lt; Korrakot /&gt;</span>
      <Link className="canvas-intro-skip" to="/home" replace>Skip intro <ArrowRight size={16} /></Link>
    </header>
    {!reducedMotion && <CareerStory duration={15} onComplete={enter} onError={enter} />}
    <p className="canvas-intro-hint">A little story, drawn by me · Skip anytime</p>
  </main>;
}

import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { intros } from '../data/intros';
import './intro-library.css';

export default function IntroLibrary() {
  return <main className="intro-library">
    <header><span className="wordmark">&lt; Korrakot /&gt;</span><Link to="/home">Enter portfolio <ArrowRight size={17} /></Link></header>
    <section className="intro-library-copy"><p><Sparkles size={16} /> A LITTLE HELLO BEFORE WE BEGIN</p><h1>Pick a little adventure<span>.</span></h1><p>One person. A few ways to meet me.</p></section>
    <div className="intro-library-grid">{intros.map((intro, index) => <Link key={intro.id} to={intro.to} className={`intro-choice intro-choice-${intro.style}`}>
      <div className="intro-choice-art"><span className="intro-choice-number">0{index + 1}</span><div className="intro-choice-orbit" /><img src={intro.image} alt="" width="714" height="1400" /><span className="intro-choice-doodle">{intro.style === 'film' ? 'ACTION!' : 'hello, world!'}</span><span className="intro-choice-play"><Play size={21} fill="currentColor" /></span></div>
      <div className="intro-choice-copy"><small>{intro.label}</small><h2>{intro.title}</h2><p>{intro.description}</p><span>Let's go <ArrowRight size={17} /></span></div>
    </Link>)}</div>
    <footer><Link to="/home">Just here to explore? Skip to the portfolio <ArrowRight size={16} /></Link><p>Made with curiosity & a little imagination.</p></footer>
  </main>;
}

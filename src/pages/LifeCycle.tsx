import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Film, Play, RotateCw, Smartphone } from 'lucide-react';
import { lifeCycleFilms, type LifeCycleFilm } from '../data/lifeCycle';
import './life-cycle.css';

export const PORTRAIT_QUERY = '(max-width: 1100px) and (orientation: portrait)';
function FilmPlayer({ film }: { film: LifeCycleFilm }) {
  const player = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(() => window.matchMedia(PORTRAIT_QUERY).matches);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const [ended, setEnded] = useState(false);
  const [needsPlay, setNeedsPlay] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(PORTRAIT_QUERY);
    const change = () => { setPortrait(media.matches); if (media.matches) { player.current?.pause(); setNeedsPlay(true); } };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (portrait) {
      player.current?.pause();

    }
  }, [portrait, started]);
  useEffect(() => {
    const video = player.current;
    const pauseHidden = () => { if (document.hidden) video?.pause(); };
    document.addEventListener('visibilitychange', pauseHidden);
    return () => { video?.pause(); document.removeEventListener('visibilitychange', pauseHidden); };
  }, []);
  async function play() {
    if (portrait || !player.current) return;
    const video = player.current;
    if (!video.getAttribute('src')) video.src = film.src;
    setStarted(true);
    setNeedsPlay(false);
    setError(false);
    setEnded(false);
    try { await video.play(); } catch { setNeedsPlay(true); }
  }
  return <div className="life-cinema" aria-label={`${film.title} video player`}>
    {/* User-provided animation. Native controls expose playback and audio controls. */}
    {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
    <video ref={player} controls={started && !portrait} playsInline preload="none"
      aria-label={film.title} hidden={portrait || !started}
      onError={() => setError(true)} onEnded={() => setEnded(true)} />
    {portrait ? <div className="life-player-cover life-rotate">
      <div className="life-phone"><Smartphone size={58} /><RotateCw size={26} /></div>
      <span className="life-kicker">A LITTLE WIDER. A LITTLE MORE MAGIC.</span>
      <h2>Turn your phone sideways.</h2>
      <p>หมุนหน้าจอเป็นแนวนอนก่อน แล้วกดเล่นวิดีโอ</p>
      <small>หากจอไม่หมุน ลองปิดล็อกการหมุนหน้าจอ</small>
    </div> : (!started || needsPlay || error || ended) && <div className="life-player-cover">
      <span className="life-film-symbol" aria-hidden="true">✳</span>
      <span className="life-kicker">KORRAKOT / LITTLE FILMS</span>
      <h2>{film.title}</h2><p>{film.description}</p>
      {error ? <p role="alert">Video could not load. Please try again.</p> : null}
      <button className="life-play" onClick={() => { void play(); }}><Play size={20} fill="currentColor" />{ended ? 'Replay film' : started ? 'Continue watching' : 'Play film'}</button>
      {ended && <Link className="life-enter" to="/home">Enter portfolio →</Link>}
    </div>}
  </div>;
}

export default function LifeCycle() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('film') ?? lifeCycleFilms[0]!.id;
  const film = lifeCycleFilms.find((item) => item.id === selected) ?? lifeCycleFilms[0]!;
  return <section className="life-page">
    <Link className="life-home-link life-back" to="/splash">← Choose another intro</Link>
    <div className="life-heading"><div><p className="eyebrow"><Film size={16} /> LIFE CYCLE</p><h1>A life in little moments<span>.</span></h1><p>Some stories are better in motion.</p></div><span className="life-collection-count">{String(lifeCycleFilms.length).padStart(2, '0')} / FILM COLLECTION</span></div>
    <FilmPlayer key={film.id} film={film} />
    <div className="life-now"><span><i /> NOW SHOWING</span><strong>{film.title}</strong><small>Made with curiosity & a little imagination.</small></div>
    <div className="life-library"><div><p className="eyebrow">THE COLLECTION</p><h2>Little films, one growing story.</h2></div><div className="life-films">
      {lifeCycleFilms.map((item, index) => <button key={item.id} aria-pressed={item.id === selected} className="life-film-card" onClick={() => setParams({ film: item.id })}>
        <span className="life-film-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>{item.description}</small></span><Play size={18} />
      </button>)}
    </div></div>
  </section>;
}

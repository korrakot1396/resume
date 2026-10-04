import { IllustrationStory } from "../components/IllustrationStory";
import { Link } from "react-router";
import {
  Play,
  ArrowDown,
  ArrowUpRight,
  Code2,
  Heart,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import {
  certifications,
  greeting,
  profile,
  projects,
  skills,
} from "../data/portfolio";
import { images } from "../lib/images";
import { SocialLinks } from "../components/SocialLinks";
import { ResumeButton } from "../components/ResumeButton";
import { ProjectCard } from "../components/ProjectCard";
import stillPortrait from "../assets/images/korrakot-still.webp";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Software engineer
          </p>
          <h1>
            Hi, I'm <span>Korrakot.</span>
          </h1>
          <p className="nickname">
            You can call me {greeting.nickname.toLowerCase()}.
          </p>
          <p className="hero-description">{greeting.subTitle}</p>
          <div className="hero-actions">
            <Link className="button primary" to="/projects">
              Explore my work <ArrowUpRight size={18} />
            </Link>
            <ResumeButton />
          </div>
          <Link className="life-home-link" to="/life-cycle"><Play size={16} /> Watch my life in motion <ArrowUpRight size={16} /></Link>
          <div className="hero-social">
            <SocialLinks />
            <span className="location">
              <MapPin size={15} /> {profile.location}
            </span>
          </div>
        </div>
        <div className="hero-art">
          <IllustrationStory kind="home" />
          <div className="hero-orbit" aria-hidden="true" />
          <div className="portrait-doodles" aria-hidden="true">
            <Star />
            <Heart />
            <span className="portrait-key">
              <Code2 size={25} />
            </span>
          </div>
          <span className="portrait-hello">
            hello, world! <span aria-hidden="true">↴</span>
          </span>
          <span className="art-note">
            <Sparkles size={16} /> Always learning.
          </span>
          <picture>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet={stillPortrait}
            />
            <img
              src={images["korrakot.GIF"]}
              alt="Illustration of Korrakot waving hello"
              fetchPriority="high"
              width="850"
              height="934"
            />
          </picture>
          <span className="art-caption">
            &lt; turning ideas into experiences /&gt;
          </span>
        </div>
      </section>
      <div className="hero-bottom">
        <span>Thoughtful interfaces. Useful software.</span>
        <a
          href="#skills"
          onClick={(event) => {
            event.preventDefault();
            document
              .getElementById("skills")
              ?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              });
          }}
        >
          A little more about me <ArrowDown size={17} />
        </a>
      </div>
      <nav className="portfolio-highlights" aria-label="Portfolio highlights">
        <Link to="/projects">
          <strong>{String(projects.length).padStart(2, "0")}</strong>
          <span>Projects to explore</span>
          <ArrowUpRight size={19} />
        </Link>
        <Link to="/education">
          <strong>{certifications.length}</strong>
          <span>Learning milestones</span>
          <ArrowUpRight size={19} />
        </Link>
        <Link to="/experience">
          <strong>01</strong>
          <span>Journey, always evolving</span>
          <ArrowUpRight size={19} />
        </Link>
      </nav>
      <section className="section" id="skills">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What I do</p>
            <h2>Ideas meet implementation.</h2>
          </div>
          <p>From the first wireframe to the last line of code.</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <article className="skill-card" key={skill.title}>
              <div className="skill-top">
                <span className="meta">0{index + 1} / EXPERTISE</span>
                <div className="skill-art">
                  <Sparkles size={17} aria-hidden="true" />
                  <img src={images[skill.imagePath]} alt="" loading="lazy" />
                </div>
              </div>
              <h3>{skill.title}</h3>
              <ul>
                {skill.skills.map((text) => (
                  <li key={text}>{text.replace(/^⚡\s*/, "")}</li>
                ))}
              </ul>
              <div className="tags">
                {skill.softwareSkills.map((tech) => (
                  <span key={tech.skillName}>{tech.skillName}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected projects</p>
            <h2>A few things I've built.</h2>
          </div>
          <Link className="text-link" to="/projects">
            All projects <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.url} project={project} index={index} />
          ))}
        </div>
      </section>
      <section className="contact-banner">
        <div>
          <p className="eyebrow">Let's connect</p>
          <h2>Have something in mind?</h2>
          <p>I'd love to hear about it.</p>
        </div>
        <Link className="button primary" to="/contact">
          Say hello <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}

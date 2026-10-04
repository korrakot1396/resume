import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { profile } from "../data/portfolio";
import { IllustrationScene } from "../components/IllustrationScene";
import { ResumeButton } from "../components/ResumeButton";
import { SocialLinks } from "../components/SocialLinks";
import { CopyEmail } from "../components/CopyEmail";
import { EmployeeBadge } from "../components/EmployeeBadge";

export default function Contact() {
  return (
    <>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Good things start with a conversation</p>
          <h1>
            Let's build
            <br />
            <span>something great.</span>
          </h1>
          <p className="lead">
            Have a project, an opportunity, or just want to say hello? You can
            find me on these channels. I'll reply within 24 hours.
          </p>
          <SocialLinks />
          <div className="hero-actions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              Get in touch <ArrowUpRight size={18} />
            </a>
            <ResumeButton />
          </div>
        </div>
        <EmployeeBadge />
      </section>
      <section className="contact-details" aria-label="Contact details">
        <a href={`mailto:${profile.email}`}>
          <Mail />
          <span>
            <small>Email</small>
            <strong>{profile.email}</strong>
          </span>
          <ArrowUpRight size={18} />
        </a>
        <a href={`tel:${profile.phone}`}>
          <Phone />
          <span>
            <small>Phone</small>
            <strong>{profile.phone}</strong>
          </span>
          <ArrowUpRight size={18} />
        </a>
        <div>
          <MapPin />
          <span>
            <small>Based in</small>
            <strong>{profile.location}</strong>
          </span>
        </div>
      </section>
      <CopyEmail />
      <section className="quote-card">
        <p className="eyebrow">A thought I live by</p>
        <blockquote>
          “Some people dream of success while others wake up and work hard at
          it.”
        </blockquote>
        <p>
          {profile.name} · {profile.role}
        </p>
      </section>
      <section className="writing-section">
        <IllustrationScene kind="personal" />
        <div>
          <p className="eyebrow">Beyond the code</p>
          <h2>Learning. Building. Sharing.</h2>
          <p>
            I like to write powerful lessons that create an impact, and share
            what I learn along the way.
          </p>
        </div>
      </section>
    </>
  );
}

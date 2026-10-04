import { useState } from "react";
import { ArrowUpRight, Award, Search } from "lucide-react";
import { certifications, competitiveSites, degrees } from "../data/portfolio";
import { images } from "../lib/images";
import { PageHeading } from "../components/PageHeading";
import { ExternalLink } from "../components/ExternalLink";

export default function Education() {
  const [query, setQuery] = useState("");
  const filtered = certifications.filter((certificate) =>
    `${certificate.title} ${certificate.subtitle}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="A foundation for what's next"
        title="Never stop learning."
        description="My education, qualifications and the courses that keep me curious."
        illustration="education"
      />
      <section className="section compact">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Education</p>
            <h2>Where it started.</h2>
          </div>
        </div>
        {degrees.map((degree) => (
          <article className="degree-card" key={degree.title}>
            <div className="degree-logo">
              <img src={images[degree.logo_path]} alt="" />
            </div>
            <div>
              <p className="eyebrow">{degree.duration}</p>
              <h3>{degree.title}</h3>
              <p className="degree-subtitle">{degree.subtitle}</p>
              <ul className="description-list">
                {degree.descriptions.map((text) => (
                  <li key={text}>{text.replace(/^⚡\s*/, "")}</li>
                ))}
              </ul>
              <ExternalLink className="text-link" href={degree.website_link}>
                Visit university <ArrowUpRight size={17} />
              </ExternalLink>
            </div>
          </article>
        ))}
        <div className="practice-links">
          <span>Coding practice</span>
          {competitiveSites.map((site) => (
            <ExternalLink key={site.siteName} href={site.profileLink}>
              {site.siteName}
              <ArrowUpRight size={15} />
            </ExternalLink>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Continuing education</p>
            <h2>Learning along the way.</h2>
          </div>
          <span className="count-label">
            {certifications.length} certifications
          </span>
        </div>
        <div className="projects-toolbar">
          <p aria-live="polite">{filtered.length} certifications</p>
          <div className="search-field">
            <Search size={19} />
            <input
              aria-label="Search certifications"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a course or issuer"
            />
          </div>
        </div>
        <div className="certificate-grid">
          {filtered.map((certificate) => (
            <ExternalLink
              className="certificate-card"
              key={certificate.certificate_link}
              href={certificate.certificate_link}
            >
              <div className="certificate-logo">
                <img
                  src={images[certificate.logo_path]}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div>
                <p className="meta">
                  {certificate.subtitle.replace(/^[-\s]+/, "")}
                </p>
                <h3>{certificate.title}</h3>
                <span className="text-link">
                  <Award size={16} /> View certificate{" "}
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </ExternalLink>
          ))}
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <h3>No certifications found.</h3>
            <button className="button secondary" onClick={() => setQuery("")}>
              Show all certifications
            </button>
          </div>
        )}
      </section>
    </>
  );
}

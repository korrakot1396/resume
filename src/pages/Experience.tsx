import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { experience } from "../data/portfolio";
import { images } from "../lib/images";
import { PageHeading } from "../components/PageHeading";
import { ExternalLink } from "../components/ExternalLink";

export default function Experience() {
  return (
    <>
      <PageHeading
        eyebrow="My journey so far"
        title="Experience that shapes me."
        description="Work, internships and volunteering. Every team brings a new perspective and something to learn."
        illustration="experience"
      />
      <section
        className="section compact experience-sections"
        aria-label="Experience timeline"
      >
        {experience.map((section, index) => (
          <details
            className="experience-group"
            key={section.title}
            open={index === 0}
          >
            <summary>
              <span className="eyebrow">0{index + 1}</span>
              <h2>{section.title}</h2>
              <span className="count-label">
                {section.experiences.length} roles
              </span>
              <ChevronDown className="chevron" size={22} />
            </summary>
            <div className="timeline">
              {section.experiences.map((role) => (
                <article
                  className="experience-card"
                  key={`${role.company}-${role.title}`}
                >
                  <div className="company-logo">
                    <img src={images[role.logo_path]} alt="" loading="lazy" />
                  </div>
                  <div className="experience-content">
                    <p className="meta">{role.duration}</p>
                    <h3>{role.title}</h3>
                    <ExternalLink
                      className="company-link"
                      href={role.company_url}
                    >
                      {role.company}
                      <ArrowUpRight size={16} />
                    </ExternalLink>
                    <p className="location">
                      <MapPin size={14} />
                      {role.location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

import { useState } from "react";
import { useSearchParams } from "react-router";
import { ArrowUpRight, Search, X } from "lucide-react";
import { profile, projects } from "../data/portfolio";
import { filterProjects } from "../lib/projects";
import { PageHeading } from "../components/PageHeading";
import { ProjectCard } from "../components/ProjectCard";
import { ExternalLink } from "../components/ExternalLink";

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [technology, setTechnology] = useState("All");
  const technologies = ["All", "React", "JavaScript", "Java", "PHP"];
  function setQuery(value: string) {
    setParams(value ? { q: value } : {}, { replace: true });
  }
  const filtered = filterProjects(projects, query).filter(
    (project) =>
      technology === "All" ||
      project.languages.some((language) =>
        technology === "React" || technology === "PHP"
          ? language.name.toLowerCase().startsWith(technology.toLowerCase())
          : language.name === technology,
      ),
  );
  return (
    <>
      <PageHeading
        eyebrow="Built with curiosity"
        title="Projects & experiments."
        description="A collection of web, desktop and mobile applications. Different technologies, the same love for building things."
        illustration="projects"
      />
      <section className="section compact">
        <div className="projects-toolbar">
          <p aria-live="polite">{filtered.length} projects</p>
          <div className="search-field">
            <Search size={19} />
            <input
              aria-label="Search projects"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a project or technology"
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
        <div className="filter-chips" aria-label="Filter by technology">
          {technologies.map((value) => (
            <button
              key={value}
              aria-pressed={technology === value}
              onClick={() => setTechnology(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="project-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.url}
              project={project}
              index={projects.indexOf(project)}
            />
          ))}
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <Search size={30} />
            <h2>No projects found.</h2>
            <p>Try another name or a technology such as React or Java.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setTechnology("All");
              }}
            >
              Show all projects
            </button>
          </div>
        )}
        <div className="section-end">
          <ExternalLink className="button secondary" href={profile.github}>
            More on GitHub <ArrowUpRight size={18} />
          </ExternalLink>
        </div>
      </section>
    </>
  );
}

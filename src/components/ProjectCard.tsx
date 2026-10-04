import { useState } from "react";
import { ArrowUpRight, Code2, Play } from "lucide-react";
import type { Project } from "../data/portfolio";
import { projectDate } from "../lib/projects";
import { ExternalLink } from "./ExternalLink";
import { Modal } from "./Modal";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className="project-symbol">
          <Code2 size={23} />
        </span>
        <span className="project-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="meta">{projectDate(project.createdAt)}</p>
      <h3>{project.name.replaceAll("-", " ")}</h3>
      <p className="project-description">{project.description}</p>
      <div className="tags">
        {project.languages.map((language) => (
          <span key={language.name}>{language.name}</span>
        ))}
      </div>
      <div className="project-links">
        {project.url && (
          <ExternalLink href={project.url}>
            Source code <ArrowUpRight size={16} />
          </ExternalLink>
        )}
        {project.demo && (
          <ExternalLink href={project.demo}>
            Live demo <ArrowUpRight size={16} />
          </ExternalLink>
        )}
        {project.video && (
          <button onClick={() => setVideoOpen(true)}>
            <Play size={15} /> Watch video
          </button>
        )}
      </div>
      {videoOpen && (
        <Modal title={project.name} onClose={() => setVideoOpen(false)}>
          <iframe
            className="video-frame"
            src={project.video}
            title={`${project.name} demo video`}
            allowFullScreen
          />
        </Modal>
      )}
    </article>
  );
}

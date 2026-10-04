import { IllustrationStory } from "./IllustrationStory";
import {
  Code2,
  GitBranch,
  GraduationCap,
  Heart,
  Lightbulb,
  PencilLine,
  Sparkles,
  Star,
} from "lucide-react";
import { images } from "../lib/images";

const scenes = {
  education: {
    image: "education.svg",
    alt: "Illustrated portrait of Korrakot in a graduation gown",
    label: "One little milestone at a time",
    caption: "Stay curious.",
    note: "A new chapter",
    Icon: GraduationCap,
  },
  experience: {
    image: "experience.svg",
    alt: "Illustration of Korrakot presenting ideas on a board",
    label: "Notes from the journey",
    caption: "Growing as I go.",
    note: "Keep growing",
    Icon: Lightbulb,
  },
  projects: {
    image: "projects_image.svg",
    alt: "Illustration of Korrakot surrounded by creative ideas and technology",
    label: "korrakot / playground",
    caption: "A little idea, made real.",
    note: "Made with curiosity",
    Icon: Code2,
  },
  community: {
    image: "projects_image.svg",
    alt: "Illustration of Korrakot surrounded by a connected world of technology",
    label: "A shared little universe",
    caption: "Better, together.",
    note: "Build · learn · share",
    Icon: GitBranch,
  },
  personal: {
    image: "blogs_image.svg",
    alt: "Illustration of Korrakot with a tiny tiger companion on his shoulder",
    label: "A little more me",
    caption: "Small moments, big ideas.",
    note: "Beyond the keyboard",
    Icon: Heart,
  },
};

export type IllustrationKind = keyof typeof scenes;

export function IllustrationScene({ kind }: { kind: IllustrationKind }) {
  const { image, alt, label, caption, note, Icon } = scenes[kind];
  return (
    <figure className={`illustration-scene scene-${kind}`}>
      <IllustrationStory kind={kind} />
      <div className="scene-backdrop" aria-hidden="true" />
      <div className="scene-doodles" aria-hidden="true">
        <Star className="doodle-star" />
        <Sparkles className="doodle-sparkles" />
        <span className="doodle-loop" />
      </div>
      <span className="scene-sticker">
        <Icon size={16} />
        {note}
      </span>
      <div className="scene-paper">
        <div className="scene-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
          <Code2 size={14} />
        </div>
        <span className="scene-tape" aria-hidden="true" />
        <img
          src={images[image]}
          alt={alt}
          className="scene-image"
          loading={kind === "personal" ? "lazy" : "eager"}
          width="440"
          height="350"
        />
        <span className="scene-label">
          <PencilLine size={13} />
          {label}
        </span>
      </div>
      <figcaption>
        {caption}
        <Heart size={14} aria-hidden="true" />
      </figcaption>
    </figure>
  );
}

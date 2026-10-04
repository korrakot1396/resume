import content from "./content.json";
import projectData from "./opensource/projects.json";

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  description: string;
  url: string;
  demo: string;
  video: string;
  languages: { name: string }[];
}
export const {
  greeting,
  skills,
  degrees,
  certifications,
  experience,
  competitiveSites,
} = content;
export const projects: Project[] = projectData.data;
export const profile = {
  name: greeting.title,
  role: "Software Engineer",
  location: "Bangkok, Thailand",
  phone: "0932813460",
  email: content.socialMediaLinks.gmail,
  github: content.socialMediaLinks.github,
};
export const socialLinks = [
  { name: "GitHub", label: "gh", url: content.socialMediaLinks.github },
  { name: "LinkedIn", label: "in", url: content.socialMediaLinks.linkedin },
  { name: "Email", label: "@", url: `mailto:${profile.email}` },
  { name: "GitLab", label: "gl", url: content.socialMediaLinks.gitlab },
  { name: "Facebook", label: "f", url: content.socialMediaLinks.facebook },
  { name: "Instagram", label: "ig", url: content.socialMediaLinks.instagram },
  {
    name: "Stack Overflow",
    label: "so",
    url: content.socialMediaLinks.stackoverflow,
  },
];

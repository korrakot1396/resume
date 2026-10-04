import type { Project } from "../data/portfolio";

export function filterProjects(projects: Project[], query: string) {
  const search = query.trim().toLocaleLowerCase();
  return projects.filter((project) =>
    [
      project.name,
      project.description,
      ...project.languages.map((language) => language.name),
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(search),
  );
}

export function projectDate(value: string) {
  // Original project dates include unpadded months and days.
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

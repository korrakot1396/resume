import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Search } from "lucide-react";
import { projects } from "../data/portfolio";
import { Modal } from "./Modal";

const items = [
  { name: "Life cycle", detail: "Animated films & life stories", to: "/life-cycle" },
  { name: "Home", detail: "About me & skills", to: "/home" },
  {
    name: "Education",
    detail: "University & certifications",
    to: "/education",
  },
  {
    name: "Experience",
    detail: "Work, internships & volunteering",
    to: "/experience",
  },
  { name: "Projects", detail: "Browse all projects", to: "/projects" },
  {
    name: "Contact me",
    detail: "Email, social profiles & resume",
    to: "/contact",
  },
  ...projects.map((project) => ({
    name: project.name.replaceAll("-", " "),
    detail: project.languages.map((language) => language.name).join(", "),
    to: `/projects?q=${encodeURIComponent(project.name)}`,
  })),
];

export function QuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
  const results = items.filter((item) =>
    `${item.name} ${item.detail}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <button
        className="icon-button quick-search-toggle"
        aria-label="Search portfolio"
        title="Search portfolio (⌘K or Ctrl+K)"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
      >
        <Search size={19} />
        <kbd>⌘K</kbd>
      </button>
      {open && (
        <Modal title="Find your way around" onClose={() => setOpen(false)}>
          <div className="search-field command-input">
            <Search size={19} />
            <input
              aria-label="Search pages and projects"
              placeholder="Search pages, projects, technologies…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="command-results">
            {results.map((item) => (
              <Link key={item.name} to={item.to} onClick={() => setOpen(false)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </div>
          {!results.length && (
            <p className="empty-state">
              No matches. Try a page name or technology.
            </p>
          )}
          <p className="command-hint">
            Tab to move · Enter to open · Esc to close
          </p>
        </Modal>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearch } from "./QuickSearch";

const navigation = [
  { to: "/home", label: "Home" },
  { to: "/education", label: "Education" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/life-cycle", label: "Life cycle" },
  { to: "/contact", label: "Contact me" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="wordmark"
          to="/splash"
          aria-label="Replay Korrakot intro"
          onClick={() => setOpen(false)}
        >
          <span>&lt;</span> Korrakot <span>/&gt;</span>
        </Link>
        <nav
          id="primary-nav"
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
        >
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <QuickSearch />
          <ThemeToggle />
          <button
            ref={toggle}
            className="icon-button menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const title =
      navigation.find((item) => item.to === pathname)?.label ?? "Portfolio";
    document.title = `${title} | ${profile.name}`;
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <Header key={pathname} />
      <main id="main-content" className="container" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer container">
        <div>
          <Link className="footer-name" to="/home">
            {profile.name}
          </Link>
          <p>Made with care, curiosity & a little coffee.</p>
        </div>
        <div className="footer-links">
          <Link to="/opensource">
            Open source <ArrowUpRight size={15} />
          </Link>
          <a href={`mailto:${profile.email}`}>
            Say hello <ArrowUpRight size={15} />
          </a>
        </div>
      </footer>
    </>
  );
}

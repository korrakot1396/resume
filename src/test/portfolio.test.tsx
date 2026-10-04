import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import App from "../App";
import { projects } from "../data/portfolio";
import { filterProjects, projectDate } from "../lib/projects";

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("portfolio routes and interactions", () => {
  it("opens the home route with the original profile and all social links", async () => {
    renderPage("/home");
    expect(
      await screen.findByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      expect.stringContaining("korrakot-triwichian"),
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "mailto:korrakot.tr@gmail.com",
    );
  });

  it("opens and closes the resume without navigating away", async () => {
    const user = userEvent.setup();
    renderPage("/contact");
    await user.click(
      await screen.findByRole("button", { name: /See my resume/i }),
    );
    const dialog = screen.getByRole("dialog", { name: "Korrakot's resume" });
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "alt",
      "Resume of Korrakot Triwichian",
    );
    expect(
      within(dialog).getByRole("link", { name: "Download PDF" }),
    ).toHaveAttribute("download");
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("filters projects and resets a no-result search", async () => {
    const user = userEvent.setup();
    renderPage("/projects");
    const input = await screen.findByRole("textbox", {
      name: "Search projects",
    });
    await user.type(input, "  android  ");
    expect(
      screen.getByRole("heading", { name: "KU Social Application" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Monfin Project" }),
    ).not.toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "not-a-real-project");
    expect(
      screen.getByRole("heading", { name: "No projects found." }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show all projects" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("preserves project video previews and the source URL", async () => {
    const user = userEvent.setup();
    renderPage("/projects?q=Share-Travel");
    await user.click(
      await screen.findByRole("button", { name: "Watch video" }),
    );
    expect(
      screen.getByTitle("Share-Travel-Expenses demo video"),
    ).toHaveAttribute("src", "https://www.youtube.com/embed/LbcO3CZLvZ4");
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source code" })).toHaveAttribute(
      "href",
      "https://github.com/korrakot1396/Share-Travel-Expenses",
    );
  });

  it("distinguishes Java from JavaScript in technology filters", async () => {
    const user = userEvent.setup();
    renderPage("/projects");
    await user.click(await screen.findByRole("button", { name: /^Java$/ }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "KU Cinema" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Monfin Project" }),
    ).not.toBeInTheDocument();
  });

  it("finds certificates by issuer and opens the original link", async () => {
    const user = userEvent.setup();
    renderPage("/education");
    await user.type(
      await screen.findByRole("textbox", { name: "Search certifications" }),
      "HackerRank",
    );
    expect(screen.getByText("3 certifications")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /React \(Basic\) Certificate/ }),
    ).toHaveAttribute(
      "href",
      "https://www.hackerrank.com/certificates/51997dcc168c",
    );
  });

  it("navigates with the mobile menu and closes it after selection", async () => {
    const user = userEvent.setup();
    renderPage("/home");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(
      within(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).getByRole("link", { name: "Experience" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Experience that shapes me.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(
      screen.getByRole("heading", { name: "Work" }).closest("details"),
    ).toHaveAttribute("open");
  });

  it("switches and remembers the theme across routes", async () => {
    const user = userEvent.setup();
    renderPage("/home");
    await user.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
    await user.click(
      within(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).getByRole("link", { name: "Contact me" }),
    );
    expect(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    ).toBeInTheDocument();
  });

  it("opens quick search from the keyboard and finds a project", async () => {
    const user = userEvent.setup();
    renderPage("/home");
    await user.keyboard("{Control>}k{/Control}");
    await user.type(
      screen.getByRole("textbox", { name: "Search pages and projects" }),
      "cinema",
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("link", {
        name: /KU Cinema/,
      }),
    );
    expect(
      await screen.findByRole("heading", { name: "KU Cinema" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("copies the email address and provides feedback", async () => {
    const user = userEvent.setup();
    renderPage("/contact");
    await user.click(
      await screen.findByRole("button", { name: "Copy email address" }),
    );
    expect(await navigator.clipboard.readText()).toBe("korrakot.tr@gmail.com");
    expect(screen.getByRole("status")).toHaveTextContent("Email copied");
  });

  it("shows the original employee badge in a larger preview", async () => {
    const user = userEvent.setup();
    renderPage("/contact");
    await user.click(
      await screen.findByRole("button", {
        name: "View my illustrated employee badge",
      }),
    );
    expect(
      within(
        screen.getByRole("dialog", { name: "My illustrated employee badge" }),
      ).getByRole("img"),
    ).toHaveAttribute("src", expect.stringContaining("address_image.svg"));
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the open-source route available", async () => {
    renderPage("/opensource");
    expect(
      await screen.findByRole("heading", { name: "Built in the open." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pull requests" }),
    ).toBeInTheDocument();
  });

  it("offers a route back home on unknown URLs", async () => {
    renderPage("/missing");
    expect(
      await screen.findByRole("link", { name: "Back to home" }),
    ).toHaveAttribute("href", "/home");
  });
});

describe("legacy project data", () => {
  it("accepts the original unpadded date format", () => {
    expect(projectDate("2021-9-16T05:00:56Z")).toBe("Sep 2021");
    expect(projectDate("2019-12-5T13:13:00Z")).toBe("Dec 2019");
  });
  it("searches case-insensitively across descriptions and technologies", () => {
    expect(filterProjects(projects, "  FIREBASE ")).toHaveLength(2);
    expect(filterProjects(projects, "")).toHaveLength(6);
  });
});

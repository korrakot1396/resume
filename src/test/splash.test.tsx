import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

const introAlt = "Korrakot's original animated student illustration";
function open(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("restored intro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows the original artwork at the entry route then enters after 15 seconds", () => {
    open();
    fireEvent.load(screen.getByAltText(introAlt));
    act(() => vi.advanceTimersByTime(14999));
    expect(screen.getByAltText(introAlt)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
  });

  it("tells all four chapters in order before entering Home", () => {
    open();
    expect(screen.getByLabelText("Starting career story")).toBeVisible();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("01 / THE BEGINNING")).toBeVisible();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("02 / FINDING MY THING")).toBeVisible();
    expect(screen.getByAltText(introAlt)).toHaveAttribute("src", expect.stringContaining("story-cs"));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("03 / A MILESTONE")).toBeVisible();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText("04 / THE NEXT CHAPTER")).toBeVisible();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("heading", { name: "Hi, I'm Korrakot." })).toBeVisible();
  });

  it("allows immediate skipping on the explicit splash route", () => {
    open("/splash");
    fireEvent.click(screen.getByRole("link", { name: "Skip intro" }));
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not block visitors when the image never loads", () => {
    open();
    act(() => vi.advanceTimersByTime(15000));
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
  });

  it("keeps the hard deadline when the image loads late", () => {
    open();
    act(() => vi.advanceTimersByTime(14500));
    fireEvent.load(screen.getByAltText(introAlt));
    act(() => vi.advanceTimersByTime(500));
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
  });

  it("enters immediately when artwork cannot load", () => {
    open();
    fireEvent.error(screen.getByAltText(introAlt));
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
  });

  it("skips motion without requesting the intro for reduced-motion visitors", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    open();
    expect(screen.queryByAltText(introAlt)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Hi, I'm Korrakot." }),
    ).toBeVisible();
  });

  it("clears timers on unmount", () => {
    const view = open();
    fireEvent.load(screen.getByAltText(introAlt));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IllustrationStory } from "../components/IllustrationStory";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe("illustration story player", () => {
  it("opens on demand, pauses, advances, replays, and closes", () => {
    vi.useFakeTimers();
    render(<IllustrationStory kind="contact" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play contact illustration story" }));
    expect(screen.getByRole("dialog", { name: "Me, illustrated" })).toBeVisible();
    expect(screen.getByText("A sketch of myself…")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Pause story" }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("A sketch of myself…")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Play story" }));
    act(() => vi.advanceTimersByTime(2400));
    expect(screen.getByText("A little personality on a badge.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Nice to meet you!")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Restart illustration story" }));
    expect(screen.getByText("A sketch of myself…")).toBeVisible();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("lets reduced-motion visitors advance manually without autoplay", () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    render(<IllustrationStory kind="education" />);
    fireEvent.click(screen.getByRole("button", { name: "Play education illustration story" }));
    act(() => vi.advanceTimersByTime(9000));
    expect(screen.getByText("It started with a question…")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Then came a lot of learning.")).toBeVisible();
  });
});

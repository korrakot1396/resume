import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { createStory, loadStoryAssets, loadStoryFonts } from '../features/career-story/storyEngine';

vi.mock('../features/career-story/storyEngine', () => ({ createStory: vi.fn(), loadStoryAssets: vi.fn(), loadStoryFonts: vi.fn() }));
const play = vi.fn(), pause = vi.fn(), destroy = vi.fn();
function open(path = '/') { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }
async function ready() { await act(async () => { await Promise.resolve(); }); }

describe('canvas intro integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
    vi.mocked(loadStoryAssets).mockResolvedValue({} as Awaited<ReturnType<typeof loadStoryAssets>>);
    vi.mocked(loadStoryFonts).mockResolvedValue();
    vi.mocked(createStory).mockReturnValue({ play, pause, destroy, resize: vi.fn(), renderAt: vi.fn(), time: () => 0, isPlaying: () => true });
  });
  afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
  it('loads all six sprites and enters Home when the 15-second playback finishes', async () => {
    open(); await ready();
    expect(Object.keys(vi.mocked(loadStoryAssets).mock.calls[0]![0])).toHaveLength(6);
    const options = vi.mocked(createStory).mock.calls[0]![3]!;
    expect(options.duration).toBe(15);
    expect(play).toHaveBeenCalled();
    act(() => options.onComplete?.());
    expect(screen.getByRole('heading', { name: "Hi, I'm Korrakot." })).toBeVisible();
    expect(destroy).toHaveBeenCalled();
  });
  it('can skip immediately before images load', () => {
    open('/splash'); fireEvent.click(screen.getByRole('link', { name: 'Skip intro' }));
    expect(screen.getByRole('heading', { name: "Hi, I'm Korrakot." })).toBeVisible();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('replays through the header wordmark', async () => {
    open('/home'); fireEvent.click(screen.getByRole('link', { name: 'Replay Korrakot intro' })); await ready();
    expect(screen.getByRole('img', { name: /Korrakot.s career story/ })).toBeVisible();
  });
  it('does not trap visitors when assets fail or stall', async () => {
    vi.mocked(loadStoryAssets).mockReturnValue(new Promise(() => {}));
    open(); act(() => vi.advanceTimersByTime(10000)); await ready();
    expect(screen.getByRole('heading', { name: "Hi, I'm Korrakot." })).toBeVisible();
  });
  it('handles a rejected image request', async () => {
    vi.mocked(loadStoryAssets).mockRejectedValue(new Error('image missing')); open(); await ready();
    expect(screen.getByRole('heading', { name: "Hi, I'm Korrakot." })).toBeVisible();
  });
  it('pauses playback on demand and destroys it on unmount', async () => {
    const view = open(); await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Pause animation' })); expect(pause).toHaveBeenCalled();
    view.unmount(); expect(destroy).toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(0);
  });
  it('jumps to a selected chapter without leaving the intro', async () => {
    open(); await ready();
    fireEvent.click(screen.getByRole('button', { name: 'Jump to Graduation chapter' }));
    const story = vi.mocked(createStory).mock.results[0]!.value;
    expect(story.pause).toHaveBeenCalled();
    expect(story.renderAt).toHaveBeenCalledWith(11.1);
    expect(screen.getByRole('link', { name: 'Skip intro' })).toBeVisible();
  });
  it('skips the intro for reduced motion', () => {
    vi.mocked(window.matchMedia).mockReturnValueOnce({ matches: true } as MediaQueryList);
    open(); expect(loadStoryAssets).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: "Hi, I'm Korrakot." })).toBeVisible();
  });
});

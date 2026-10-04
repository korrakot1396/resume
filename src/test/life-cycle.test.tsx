import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LifeCycle, { PORTRAIT_QUERY } from '../pages/LifeCycle';
import IntroLibrary from '../pages/IntroLibrary';

afterEach(() => vi.restoreAllMocks());
describe('intro collection and mobile video', () => {
  it('offers both intros and a direct route to the portfolio', () => {
    render(<MemoryRouter><IntroLibrary /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /The illustrated story/ })).toHaveAttribute('href', '/intro/story');
    expect(screen.getByRole('link', { name: /A little journey/ })).toHaveAttribute('href', '/life-cycle?film=little-journey');
    expect(screen.getByRole('link', { name: 'Enter portfolio' })).toHaveAttribute('href', '/home');
  });
  it('requires landscape before playback and pauses if rotated back', async () => {
    let change = () => {};
    const media = { matches: true, media: PORTRAIT_QUERY, addEventListener: (_: string, fn: () => void) => { change = fn; }, removeEventListener: vi.fn() };
    vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList);
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    const view = render(<MemoryRouter><LifeCycle /></MemoryRouter>);
    const video = view.container.querySelector('video')!;
    expect(screen.getByText('Turn your phone sideways.')).toBeVisible();
    expect(video).not.toHaveAttribute('src');
    expect(screen.queryByRole('button', { name: 'Play film' })).not.toBeInTheDocument();
    act(() => { media.matches = false; change(); });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Play film' })));
    expect(play).toHaveBeenCalledOnce();
    expect(video.getAttribute('src')).toContain('life-cycle-01.mp4');
    act(() => { media.matches = true; change(); });
    expect(pause).toHaveBeenCalled();
    expect(video).not.toBeVisible();
    act(() => { media.matches = false; change(); });
    expect(screen.getByRole('button', { name: 'Continue watching' })).toBeVisible();
    view.unmount(); expect(media.removeEventListener).toHaveBeenCalled();
  });
  it('keeps a play button available when the browser rejects playback', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('NotAllowedError'));
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    render(<MemoryRouter><LifeCycle /></MemoryRouter>);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Play film' })));
    expect(screen.getByRole('button', { name: 'Continue watching' })).toBeVisible();
  });
});

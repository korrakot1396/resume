import firstFilm from '../assets/videos/life-cycle-01.mp4';

export type LifeCycleFilm = {
  id: string;
  title: string;
  description: string;
  src: string;
};

// Add another entry here to publish a new film in the collection.
export const lifeCycleFilms: LifeCycleFilm[] = [
  {
    id: 'little-journey',
    title: 'A little journey',
    description: 'A small animated glimpse into my world.',
    src: firstFilm,
  },
];

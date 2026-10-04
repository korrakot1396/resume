import { lifeCycleFilms } from './lifeCycle';
import student from '../features/career-story/assets/freshman.webp';
import developer from '../features/career-story/assets/work.webp';

export const intros = [
  {
    id: 'illustrated-story', title: 'The illustrated story', label: 'INTERACTIVE · 15 SECONDS',
    description: 'From a curious freshman to a software developer. Four chapters, a little magic.',
    to: '/intro/story', image: student, style: 'illustrated',
  },
  ...lifeCycleFilms.map((film) => ({
    id: film.id, title: film.title, label: 'LIFE CYCLE · SHORT FILM',
    description: film.description, to: `/life-cycle?film=${encodeURIComponent(film.id)}`,
    image: developer, style: 'film',
  })),
];

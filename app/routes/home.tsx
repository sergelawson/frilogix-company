import type { Route } from './+types/home';
import { pageMeta } from '~/lib/meta';

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Frilogix | Software & Agentic AI Engineering Company',
    description:
      'Frilogix is a software development and agentic AI engineering company. We build web, mobile and backend products, and AI agents tested in our own experiments.',
    path: '/',
  });

// Content lives in ~/sections/HomeSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Home() {
  return null;
}

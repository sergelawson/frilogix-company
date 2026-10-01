import type { Route } from './+types/home';
import { pageMeta } from '~/lib/meta';

export const meta: Route.MetaFunction = ({ matches }) =>
  pageMeta({
    title: 'Frilogix | Software & AI Engineering Company',
    description:
      'Frilogix is a software and AI engineering company building high-performance web, mobile, and AI-powered applications with React, Node.js, Go, and LLM-based systems.',
    path: '/',
    matches,
  });

// Content lives in ~/sections/HomeSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Home() {
  return null;
}

import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [
  { title: 'Frilogix | Software & AI Engineering Company' },
  {
    name: 'description',
    content:
      'Frilogix is a software and AI engineering company building high-performance web, mobile, and AI-powered applications with React, Node.js, Go, and LLM-based systems.',
  },
];

// Content lives in ~/sections/HomeSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Home() {
  return null;
}

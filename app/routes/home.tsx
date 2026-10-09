import type { Route } from './+types/home';
import { pageMeta } from '~/lib/meta';
import { site } from '~/content/site';

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Software & AI Engineering Company | Frilogix',
    description: site.description,
    path: '/',
  });

// Content lives in ~/sections/HomeSection, rendered by the one-page layout
// (routes/site.tsx). This route only supplies the URL and its meta.
export default function Home() {
  return null;
}

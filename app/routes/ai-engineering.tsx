import { redirect } from 'react-router';

/**
 * The standalone AI Engineering page was merged into /services (it is now the
 * "AI Engineering" service card plus the "Intelligent Systems" deep-dive section).
 *
 * This route is kept purely to 301 old inbound links and any indexed URLs to the
 * new location, so existing link equity is not lost. Safe to delete once search
 * consoles show no traffic on /ai-engineering.
 */
export function loader() {
  return redirect('/services#intelligent-systems', 301);
}

import { redirect } from 'react-router';

/**
 * "Case Studies" was renamed "Work" (/work). This route only 301s old links
 * and indexed URLs to the new location.
 */
export function loader() {
    return redirect('/work', 301);
}

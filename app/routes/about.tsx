import { redirect } from 'react-router';

/**
 * "About" was renamed "Company" (/company). This route only 301s old links
 * and indexed URLs to the new location.
 */
export function loader() {
    return redirect('/company', 301);
}

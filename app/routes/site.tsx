import { memo } from 'react';
import { Outlet } from 'react-router';
import HorizontalPages from '~/components/HorizontalPages';
import HomeSection from '~/sections/HomeSection';
import ServicesSection from '~/sections/ServicesSection';
import WorkSection from '~/sections/WorkSection';
import AboutSection from '~/sections/AboutSection';
import ContactSection from '~/sections/ContactSection';

// Order here is the scroll order — keep it matching `pages` in ~/content/site.
// Memoized so the URL updates made while scrolling don't re-render every page.
const Sections = memo(function Sections() {
    return (
        <>
            <HomeSection />
            <ServicesSection />
            <WorkSection />
            <AboutSection />
            <ContactSection />
        </>
    );
});

/**
 * The one-page site. Every page is rendered here as a section; the child
 * routes (home, services, …) render nothing and only contribute their URL and
 * `meta`. HorizontalPages scrolls to whichever page the URL names.
 */
export default function Site() {
    return (
        <>
            <HorizontalPages>
                <Sections />
            </HorizontalPages>
            <Outlet />
        </>
    );
}

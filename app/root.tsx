import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  isRouteErrorResponse,
} from "react-router";
import monaSans from "@fontsource-variable/mona-sans/files/mona-sans-latin-standard-normal.woff2?url";

import type { Route } from "./+types/root";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import GoogleAnalytics from "~/components/GoogleAnalytics";
import { ButtonLink } from "~/components/ui/Button";
import Eyebrow from "~/components/ui/Eyebrow";
import "@fontsource-variable/mona-sans/standard.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  // Self-hosted fonts; preload the Latin Mona Sans file the headings render in.
  { rel: "preload", href: monaSans, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

// Used only when no child route matches (the 404 page): page routes return
// their full set through pageMeta(), which replaces this rather than merging.
export const meta: Route.MetaFunction = () => [
  { title: "Frilogix | Software & AI Engineering" },
  {
    name: "description",
    content:
      "Frilogix builds intelligent, scalable web, mobile, and AI-powered applications using modern technologies such as React, Node.js, Go, React Native, and LLM-based systems.",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f6f7f7" />
        <Meta />
        <Links />
        <GoogleAnalytics />
      </head>
      <body className="font-sans overflow-x-hidden min-h-screen">
        {children}
        {/* No <ScrollRestoration />: HorizontalPages owns scroll position for the one-page site. */}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-grow outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Something went wrong";
  let detail = "An unexpected error occurred. Please try again.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    heading = error.status === 404 ? "Page not found" : `${error.status}`;
    detail =
      error.status === 404
        ? "The page you're looking for doesn't exist or has moved."
        : error.statusText || detail;
  } else if (import.meta.env.DEV && error instanceof Error) {
    detail = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-grow outline-none">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
          <Eyebrow>{isRouteErrorResponse(error) ? `Error ${error.status}` : "Error"}</Eyebrow>
          <h1 className="mt-4 font-wide text-display font-semibold">{heading}</h1>
          <p className="mt-6 max-w-xl text-lede text-fg-muted">{detail}</p>
          <ButtonLink to="/" size="lg" arrow className="mt-10">
            Back to home
          </ButtonLink>
          {stack ? (
            <pre className="mt-16 w-full overflow-x-auto border border-line bg-surface p-6 text-left font-mono text-xs">
              <code>{stack}</code>
            </pre>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

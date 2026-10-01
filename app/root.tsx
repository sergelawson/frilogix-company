import type { ReactNode } from "react";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";

import type { Route } from "./+types/root";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
];

export const meta: Route.MetaFunction = () => [
  { title: "Frilogix | Intelligent Software & AI Engineering" },
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
        <Meta />
        <Links />
      </head>
      <body className="font-sans overflow-x-hidden min-h-screen">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
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
      <main className="flex-grow pt-40 pb-20 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-light text-brand-dark mb-10 tracking-tight">
            {heading}
          </h1>
          <p className="text-2xl text-brand-gray max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            {detail}
          </p>
          <Link
            to="/"
            className="inline-block px-12 py-5 bg-primary text-white font-medium text-lg rounded-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            Back to home
          </Link>
          {stack ? (
            <pre className="mt-16 w-full overflow-x-auto text-left text-xs font-mono bg-surface border border-secondary/20 p-6 rounded-sm">
              <code>{stack}</code>
            </pre>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

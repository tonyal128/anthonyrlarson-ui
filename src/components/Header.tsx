import { Link, useNavigate } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Header() {
  const { authStatus, signOut } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0">
          <Link
            to="/"
            className="flex items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] p-1 transition hover:bg-[var(--link-bg-hover)]"
          >
            <img
              src="/favicon.png"
              alt="Anthony Larson"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </h2>

        <div className="flex items-center gap-x-4 gap-y-1 text-sm font-semibold">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <a href="/#experience" className="nav-link">
            Experience
          </a>
          <a href="/#projects" className="nav-link">
            Projects
          </a>
          {authStatus === "authenticated" && (
            <Link
              to="/admin"
              className="nav-link"
              activeProps={{ className: "nav-link is-active" }}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <a
            href="https://github.com/tonyal128"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">GitHub</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/anthonyrlarson"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block"
          >
            <span className="sr-only">LinkedIn</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>

          <ThemeToggle />

          {authStatus === "authenticated" ? (
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="ml-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)] shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition hover:bg-[var(--link-bg-hover)] sm:px-4 sm:py-2 sm:text-sm"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)] shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition hover:bg-[var(--link-bg-hover)] sm:px-4 sm:py-2 sm:text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

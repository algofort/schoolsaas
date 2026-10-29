"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, GraduationCap, Menu, Moon, Search, Sun, X } from "lucide-react";
import { modules } from "@/config/modules";
import { cn } from "@/lib/utils";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  useEffect(() => {
    const saved = localStorage.getItem("school-theme") || "light";
    document.documentElement.dataset.schoolTheme = saved;
    // Browser-only preference; does not represent a signed-in school.
    setTheme(saved); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
      if (event.key !== "Tab") return;
      const elements = sidebar.current?.querySelectorAll<HTMLElement>("a, button");
      if (!elements?.length) return;
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.schoolTheme = next;
    localStorage.setItem("school-theme", next);
  }
  const current = modules.find((item) => path === `/${item.slug}`);
  const matches = modules.filter((item) =>
    `${item.label} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  function closeNavigation() {
    setMobileOpen(false);
    setQuery("");
  }
  return (
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        ref={sidebar}
        id="school-navigation"
        className={cn("school-sidebar", mobileOpen && "is-open")}
        aria-label="Main navigation"
      >
        <div className="brand-row">
          <Link href="/dashboard" className="school-brand" onClick={closeNavigation}>
            <span className="brand-mark">
              <GraduationCap size={22} />
            </span>
            <span>
              School<span className="brand-dot">.</span>
              <small>MANAGEMENT WORKSPACE</small>
            </span>
          </Link>
          <button
            className="mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav>
          {(["Workspace", "School management", "Platform"] as const).map((group) => (
            <div className="nav-group" key={group}>
              <p>{group}</p>
              {modules
                .filter((item) => item.group === group)
                .map(({ slug, label, icon: Icon }) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className={cn("nav-item", path === `/${slug}` && "active")}
                    aria-current={path === `/${slug}` ? "page" : undefined}
                    onClick={closeNavigation}
                  >
                    <Icon size={20} strokeWidth={1.7} />
                    <span>{label}</span>
                    {slug === "automations" && <span className="nav-new">NEW</span>}
                  </Link>
                ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-spark">✦</span>
            <strong>A place for every school day.</strong>
            <p>One shared foundation. Built to grow with your team.</p>
            <Link href="/settings" onClick={closeNavigation}>
              Workspace setup <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="sidebar-credit">Akademi design foundation · v0.1</p>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="school-topbar">
          <div className="topbar-title">
            <button
              ref={menuButton}
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="school-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span>{current?.label || "Workspace"}</span>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={18} />
              <input
                aria-label="Search modules"
                placeholder="Find a module…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setQuery("");
                }}
              />
              {query && (
                <div className="search-results">
                  <p>WORKSPACE MODULES</p>
                  {matches.length ? (
                    matches.map((item) => (
                      <Link key={item.slug} href={`/${item.slug}`} onClick={closeNavigation}>
                        <item.icon size={17} />
                        {item.label}
                        <ArrowUpRight size={14} />
                      </Link>
                    ))
                  ) : (
                    <span>No matching modules</span>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button theme-toggle"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <span className="topbar-divider" />
            <Link
              href="/settings"
              className="profile-summary"
              aria-label="AddizTech administrator workspace settings"
            >
              <span className="profile-avatar">
                <GraduationCap size={23} strokeWidth={1.7} />
              </span>
              <span className="profile-details">
                <strong>AddizTech</strong>
                <small>Administrator</small>
              </span>
              <ArrowUpRight className="profile-link-icon" size={16} aria-hidden="true" />
            </Link>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="school-main">
          {children}
        </main>
        <footer className="school-footer">
          <span>School Management System</span>
          <span>Foundation preview · Sample data only</span>
        </footer>
      </div>
    </div>
  );
}

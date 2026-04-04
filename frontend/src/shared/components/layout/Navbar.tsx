// D:\schoolapp\frontend\src\shared\components\layout\Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    console.log("Searching for:", searchTerm);
  };

  // Ctrl+K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check for saved dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left"></div>

      <div className="search-wrapper">
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search anything... (e.g., students, fees, attendance)"
            onChange={handleSearch}
          />
          <span className="search-shortcut">Ctrl+K</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification-bell">
          <i className="fa-regular fa-bell"></i>
        </div>

        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </div>

        <div className="profile-dropdown">
          <div className="dropdown-trigger">
            <div className="profile-avatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div className="dropdown-menu">
            <a href="#">
              <i className="fa-regular fa-user"></i>
              <span>My Profile</span>
            </a>
            <a href="#">
              <i className="fa-regular fa-gear"></i>
              <span>Settings</span>
            </a>
            <hr />
            <a href="#">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
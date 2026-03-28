"use client";

export default function Navbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <i
          className="fa-solid fa-bars hamburger"
          onClick={toggleSidebar}
        ></i>

        <span className="navbar-title">Dashboard</span>
      </div>

      <div className="navbar-right">
        <i className="fa-regular fa-bell"></i>

        <div className="user-profile">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
    </div>
  );
}
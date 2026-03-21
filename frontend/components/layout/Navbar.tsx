"use client";

export default function Navbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="navbar-left">
        <i
          className="fa-solid fa-bars hamburger"
          onClick={toggleSidebar}
        ></i>

        <span className="navbar-title">Dashboard</span>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* Notifications */}
        <i className="fa-regular fa-bell"></i>

        {/* User */}
        <div className="user-profile">
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
    </div>
  );
}
import { Link, Outlet } from "react-router-dom";

export default function ViewNavigation() {
  return (
    <>
      <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/">Home</Link>
      </nav>
      <Outlet />
    </>
  );
}

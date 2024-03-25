import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../context/LoginContext";

export default function AuthorNavigation() {
  const { setIsLoggedIn } = useContext(LoginContext);

  const logOutHandler = () => {
    Cookies.remove("Authorization");
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/author">Home</Link>
        <button onClick={logOutHandler}>Log out</button>
      </nav>
      <Outlet />
    </>
  );
}

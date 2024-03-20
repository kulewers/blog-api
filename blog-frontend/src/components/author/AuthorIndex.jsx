import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../context/LoginContext";

export default function AuthorIndex() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/author/login");
    }
  }, [isLoggedIn]);

  const logOutHandler = () => {
    Cookies.remove("Authentication");
    setIsLoggedIn(false);
  };

  return (
    <>
      <h1>Hello, Admin</h1>
      <button onClick={logOutHandler}>Log out</button>
    </>
  );
}

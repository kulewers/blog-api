import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginContext } from "../../context/LoginContext";

export default function ProtectedRoute() {
  const { userToken, setUserToken } = useContext(LoginContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      const token = Cookies.get("Authorization");
      // TODO: send server request to validate the token (if it's a good practice)
      if (token) {
        setUserToken(token);
      } else {
        navigate("/author/login");
      }
    }
  }, [userToken]);

  return <Outlet />;
}

import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { LoginContext } from "../../context/LoginContext";

export default function Login() {
  const [errorMessages, setErrorMessages] = useState([]);

  const { userToken, setUserToken } = useContext(LoginContext);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      navigate("/author");
    }
  }, [userToken]);

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const res = await response.json();

      const errors = res.errors.map((obj) => obj.msg);

      setErrorMessages([...errors]);

      throw new Error("Authorization failure");
    }

    const { token } = await response.json();
    Cookies.set("Authorization", `Bearer ${token}`, { secure: true });
    setUserToken(token);
    navigate("/author");
  };

  return (
    <>
      <div>
        <h1>Please log in to view the site</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", width: "180px" }}
        >
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...register("username")} />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password")} />
          <br />
          <button type="submit">Log in</button>
        </form>
      </div>
      <div>
        {errorMessages?.map((error, index) => (
          <p style={{ color: "red" }} key={index}>
            {error}
          </p>
        ))}
      </div>
    </>
  );
}

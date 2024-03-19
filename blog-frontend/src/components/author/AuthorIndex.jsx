import { useForm } from "react-hook-form";

export default function AuthorIndex() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(response);
      throw new Error("Authorization failure");
    }

    const token = await response.json();
  };

  return (
    <div>
      <h1>Please log in to view the site</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register("username")} />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register("password")} />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

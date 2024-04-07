import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginContext } from "../../context/LoginContext";

export default function Create() {
  const url = `http://localhost:3000/posts`;

  const { userToken } = useContext(LoginContext);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitPost = async (data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Post create failed");
    }

    const responnseData = await response.json();
    const postId = responnseData._id;

    navigate(`/author/posts/${postId}`);
  };

  return (
    <div>
      <h1>Create post</h1>
      <form onSubmit={handleSubmit(submitPost)}>
        <label htmlFor="title">Title: </label>
        <br />
        <input type="text" id="title" {...register("title")} />
        <br />
        <label htmlFor="body">Body: </label>
        <br />
        <textarea id="body" cols={50} rows={10} {...register("body")} />
        <br />
        <label htmlFor="publish">
          <input type="checkbox" id="publish" {...register("publish")} />
          Publish now (unpublished posts will be saved as drafts)
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

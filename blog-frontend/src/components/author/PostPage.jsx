import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import CommentSection from "./CommentSection";
import { LoginContext } from "../../context/LoginContext";

export default function PostPage() {
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, postFetchError } = useFetch(url, { authorize: true });
  const { data: comments } = useFetch(url + "/comments", { authorize: true });

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (postFetchError) {
      navigate("/author/not-found", { replace: true });
    }
  }, [postFetchError]);

  const onCancel = () => setIsEditing(false);

  return (
    <div>
      {post &&
        (isEditing ? (
          <PostEditForm defaults={post} onCancel={onCancel} url={url} />
        ) : (
          <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <p>
              {post.publishDate &&
                "Published: " + new Date(post.publishDate).toLocaleDateString()}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        ))}
      <CommentSection comments={comments} />
    </div>
  );
}

function PostEditForm({ defaults, onCancel, url }) {
  const { userToken } = useContext(LoginContext);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitEdit = async (data) => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Post edit failed");
    }

    navigate(0);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitEdit)}>
        <label htmlFor="title">Title: </label>
        <br />
        <input
          type="text"
          id="title"
          defaultValue={defaults.title}
          {...register("title")}
        />
        <br />
        <label htmlFor="body">Body: </label>
        <br />
        <textarea
          id="body"
          defaultValue={defaults.body}
          cols={50}
          rows={10}
          {...register("body")}
        />
        <br />
        <label htmlFor="publish">Publish: </label>
        <input
          type="checkbox"
          id="publish"
          defaultChecked={defaults.publishStatus === "published" ? true : false}
          {...register("publish")}
        />
        <br />
        <button type="submit">Submit</button>
        <button onClick={onCancel} type="button">
          Cancel
        </button>
      </form>
    </div>
  );
}

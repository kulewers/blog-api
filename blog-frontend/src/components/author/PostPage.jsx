import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CommentSection from "./CommentSection";
import useFetch from "../../hooks/useFetch";
import { LoginContext } from "../../context/LoginContext";

export default function PostPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showingDeletionConfirmation, setShowingDeletionConfirmation] =
    useState(false);

  const { userToken } = useContext(LoginContext);
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, postFetchError } = useFetch(url, { authorize: true });
  const { data: comments } = useFetch(url + "/comments", { authorize: true });

  const navigate = useNavigate();

  useEffect(() => {
    if (postFetchError) {
      navigate("/author/not-found", { replace: true });
    }
  }, [postFetchError]);

  const handleDelete = async () => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: userToken,
      },
    });

    if (!response.ok) {
      throw new Error("Post deletion failure");
    }

    navigate("/author/posts");
  };

  return (
    <div>
      {post &&
        (isEditing ? (
          <PostEditForm
            defaults={post}
            onCancel={() => setIsEditing(false)}
            url={url}
          />
        ) : (
          <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <p>
              {post.publishDate &&
                "Published: " + new Date(post.publishDate).toLocaleDateString()}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button
              onClick={() => setShowingDeletionConfirmation(true)}
              style={{ marginLeft: "4px" }}
            >
              Delete
            </button>
            <ConfirmDeletionModal
              show={showingDeletionConfirmation}
              onCancel={() => setShowingDeletionConfirmation(false)}
              onDelete={handleDelete}
            />
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
        <button onClick={onCancel} type="button" style={{ marginLeft: "4px" }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

function ConfirmDeletionModal({ show, onCancel, onDelete }) {
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <p style={{ color: "red" }}>Are you sure you want to delete this post?</p>
      <button onClick={onDelete}>Confirm</button>
      <button onClick={onCancel} style={{ marginLeft: "4px" }}>
        Cancel
      </button>
    </div>
  );
}

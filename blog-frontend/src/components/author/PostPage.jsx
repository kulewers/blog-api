import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CommentSection from "./CommentSection";
import useFetch from "../../hooks/useFetch";
import { LoginContext } from "../../context/LoginContext";

export default function PostPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);

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

  const handleChangeStatus = async () => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",

        Authorization: userToken,
      },
      body: JSON.stringify({
        title: post.title,
        body: post.body,
        publish: post.publishStatus === "published" ? "false" : "true",
      }),
    });

    if (!response.ok) {
      throw new Error("Post edit failure");
    }

    navigate(0);
  };

  return (
    <div>
      {post &&
        (isEditing ? (
          <PostEditForm
            data={post}
            onCancel={() => setIsEditing(false)}
            url={url}
          />
        ) : (
          <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <p
              style={{
                border: "1px solid #aaa",
                display: "inline-block",
                padding: "6px",
                backgroundColor: "#eee",
              }}
            >
              {post.publishStatus === "published"
                ? "Published: " +
                  new Date(post.publishDate).toLocaleDateString()
                : "Post still in drafts"}
            </p>
            <br />
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button
              onClick={() => setCurrentModal("changePublishStatus")}
              style={{ marginLeft: "4px" }}
            >
              {post.publishStatus === "published" ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => setCurrentModal("delete")}
              style={{ marginLeft: "4px" }}
            >
              Delete
            </button>
            <ConfirmChangePublishStatusModal
              show={currentModal === "changePublishStatus"}
              onCancel={() => setCurrentModal(null)}
              onConfirm={handleChangeStatus}
            />
            <ConfirmDeletionModal
              show={currentModal === "delete"}
              onCancel={() => setCurrentModal(null)}
              onDelete={handleDelete}
            />
          </div>
        ))}
      <CommentSection comments={comments} />
    </div>
  );
}

function PostEditForm({ data, onCancel, url }) {
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
      <h1>Editing post: {data.title}</h1>
      <form onSubmit={handleSubmit(submitEdit)}>
        <label htmlFor="title">Title: </label>
        <br />
        <input
          type="text"
          id="title"
          defaultValue={data.title}
          {...register("title")}
        />
        <br />
        <label htmlFor="body">Body: </label>
        <br />
        <textarea
          id="body"
          defaultValue={data.body}
          cols={50}
          rows={10}
          {...register("body")}
        />
        <br />
        <label htmlFor="publish">
          <input
            type="checkbox"
            id="publish"
            defaultChecked={data.publishStatus === "published" ? true : false}
            {...register("publish")}
          />
          Publish
        </label>
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

function ConfirmChangePublishStatusModal({ show, onCancel, onConfirm }) {
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <p style={{ color: "red" }}>
        Are you sure you want to change this post's publish status?
      </p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel} style={{ marginLeft: "4px" }}>
        Cancel
      </button>
    </div>
  );
}

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFetch from "../../hooks/useFetch";

export default function PostPage() {
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, error } = useFetch(url);
  const { data: comments } = useFetch(url + "/comments");

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate("/view/not-found", { replace: true });
    }
  }, [error]);

  const commentSubmit = async (data) => {
    const response = await fetch(url + "/comments", {
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

      throw new Error("Comment failed");
    }
    navigate(0);
  };

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <p>{new Date(post.publishDate).toLocaleDateString()}</p>
        </div>
      )}
      {comments && (
        <div>
          <h3>Comments:</h3>
          {comments.length == 0 ? (
            <p>There are no comments on this post</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  border: "1px solid #aaa",
                  padding: "12px",
                  marginTop: "8px",
                }}
              >
                <p>{comment.body}</p>
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit(commentSubmit)}
        style={{ display: "flex", flexDirection: "column", width: "250px" }}
      >
        <p>Make a comment:</p>
        <label for="email">Your email (only visible to post creator): </label>
        <input
          type="email"
          id="email"
          name="creatorEmail"
          {...register("creatorEmail")}
        />
        <label for="body">Body:</label>
        <textarea id="body" name="body" rows={6} {...register("body")} />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

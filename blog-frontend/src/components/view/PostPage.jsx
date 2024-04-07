import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import CommentSection from "./CommentSection";
import CommentForm from "./CommentForm";

export default function PostPage() {
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, error: fetchError } = useFetch(url);
  const { data: comments } = useFetch(url + "/comments");
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchError) {
      navigate("/view/not-found", { replace: true });
    }
  }, [fetchError]);

  return (
    <div>
      {post && (
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
            {"Published: " + new Date(post.publishDate).toLocaleDateString()}
          </p>
        </div>
      )}
      <CommentSection comments={comments} />
      <CommentForm url={url + "/comments"} />
    </div>
  );
}

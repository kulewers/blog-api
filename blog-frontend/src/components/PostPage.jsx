import { useParams } from "react-router-dom";
import { useState } from "react";
import useFetch from "../hooks/useFetch";

export default function PostPage() {
    const { postId } = useParams();
    const [url, setUrl] = useState(`http://localhost:3000/posts/${postId}`);
    const [post, loading, error] = useFetch(url);

    return (
        <div>
            {loading && <h3>Loading...</h3>}
            {error && <h3>{error}</h3>}
            {post && (
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.body}</p>
                    <br />
                    <p>{post.publishDate}</p>
                </div>
            )}
        </div>
    );
}

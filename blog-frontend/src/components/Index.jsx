import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Index() {
    const [url, setUrl] = useState("http://localhost:3000/posts");
    const [posts, loading, error] = useFetch(url);

    return (
        <div>
            {loading && <h3>Loading...</h3>}
            {error && <h3>{error}</h3>}
            {posts && (
                <ul>
                    {posts.map((post) => {
                        return (
                            <li key={post._id}>
                                <Link to={`posts/${post._id}`}>
                                    {post.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

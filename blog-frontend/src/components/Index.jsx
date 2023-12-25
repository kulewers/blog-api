import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Index() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            const res = await axios.get("http://localhost:3000/posts");
            const posts = res.data;
            setPosts(posts);
        };
        getPosts();
    }, []);

    return (
        <>
            <ul>
                {posts &&
                    posts.map(function (post) {
                        return (
                            <li key={post._id}>
                                <Link to={`posts/${post._id}`}>
                                    {post.title}
                                </Link>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
}

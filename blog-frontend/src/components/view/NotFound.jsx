import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <>
      <h1>Item not found</h1>
      <Link to={`/view`}>Go to all posts</Link>
    </>
  );
}

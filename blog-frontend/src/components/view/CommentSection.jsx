export default function CommentSection({ comments }) {
  return (
    <>
      {comments && (
        <>
          <h3>Comments:</h3>
          {comments.length == 0 ? (
            <p>There are no comments on this post</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  style={{
                    border: "1px solid #aaa",
                    padding: "12px",
                    maxWidth: "500px",
                    backgroundColor: "#eee",
                  }}
                >
                  <p>{comment.body}</p>
                  <p>{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

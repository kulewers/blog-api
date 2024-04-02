import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

export default function Comment({ data }) {
  const [showingDeletionConfirmation, setShowingDeletionConfirmation] =
    useState(false);

  const { userToken } = useContext(LoginContext);

  const navigate = useNavigate();

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:3000/posts/${data.post}/comments/${data._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: userToken,
        },
      }
    );

    if (!response.ok) {
      const res = await response.json();

      console.error(res);
    }

    navigate(0);
  };

  return (
    <div
      style={{
        border: "1px solid #aaa",
        padding: "12px",
        marginTop: "8px",
      }}
    >
      <p>{data.body}</p>
      <p>{"By: " + data.creatorEmail}</p>
      <p>{new Date(data.timestamp).toLocaleString()}</p>
      <button
        onClick={() => {
          setShowingDeletionConfirmation(true);
        }}
      >
        Delete
      </button>
      <ConfirmDeletionModal
        show={showingDeletionConfirmation}
        onCancel={() => setShowingDeletionConfirmation(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}

function ConfirmDeletionModal({ show, onCancel, onDelete }) {
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <p style={{ color: "red" }}>
        Are you sure you want to delete this comment?
      </p>
      <button onClick={onDelete}>Confirm</button>
      <button onClick={onCancel} style={{ marginLeft: "4px" }}>
        Cancel
      </button>
    </div>
  );
}

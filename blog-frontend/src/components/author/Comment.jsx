import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

function ConfirmDeletionModal({ show, setShow, onDelete }) {
  return (
    <div style={{ display: show ? "block" : "none" }}>
      <p style={{ color: "red" }}>Are you sure you want to delete?</p>
      <button onClick={onDelete}>Confirm</button>
      <button onClick={() => setShow(false)} style={{ marginLeft: "4px" }}>
        Cancel
      </button>
    </div>
  );
}

export default function Comment({ data }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useContext(LoginContext);

  const openModal = () => {
    setShowConfirmationModal(true);
  };

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:3000/posts/${data.post}/comments/${data._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      <button onClick={openModal}>Delete</button>
      <ConfirmDeletionModal
        show={showConfirmationModal}
        setShow={setShowConfirmationModal}
        onDelete={handleDelete}
      />
    </div>
  );
}

import './DeleteModal.css'

export const DeleteModal = ({ onDelete, onCancel }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to delete this blog?</p>
        <div className="modal-actions">
          <button onClick={onDelete} className="confirm-button">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
);
  
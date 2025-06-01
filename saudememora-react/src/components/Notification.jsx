import { useEffect } from "react";
import { FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const Notification = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const icons = {
    success: <FaCheck className="me-2" />,
    error: <FaTimes className="me-2" />,
    warning: <FaExclamationTriangle className="me-2" />,
    info: <FaInfoCircle className="me-2" />
  };

  return (
    <div className={`alert alert-${type} fixed-top m-3 d-flex justify-content-between align-items-center`}>
      <div>
        {icons[type] || icons.info}
        {message}
      </div>
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
};

export default Notification;
import React from 'react';

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-md" onClick={onClose}>
      <div className="bg-zinc-800 rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
        <h2 className="text-3xl font-semibold mb-4 text-zinc-500">{title}</h2>
        <div className="modal-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;

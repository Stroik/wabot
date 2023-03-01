interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  children,
}) => {
  const modalClasses = `modal flex items-center justify-center ${
    isOpen ? "opacity-100" : "opacity-100 pointer-events-none"
  } fixed inset-0 z-50`;
  const overlayClasses = `${
    isOpen ? "fixed" : "hidden"
  } inset-0 bg-gray-500 opacity-100 z-40 `;
  const contentClasses =
    "relative w-auto max-w-md bg-white rounded-lg shadow-lg";
  const headerClasses =
    "p-4 border-b border-gray-400 flex justify-between items-center";
  const titleClasses = "text-lg font-semibold";
  const closeClasses = "text-zinc-800 hover:text-gray-700 cursor-pointer";
  const bodyClasses = "p-2";
  const footerClasses = "p-4 border-t border-gray-400 flex justify-end";

  return (
    <div className={overlayClasses}>
      <div className={modalClasses}>
        <div className={contentClasses}>
          <div className={headerClasses}>
            <div className={titleClasses}>{title}</div>
            <div className={closeClasses} onClick={onClose}>
              X
            </div>
          </div>
          <div className={bodyClasses}>{children}</div>
          <div className={footerClasses}>
            <div className="flex">
              <button
                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onConfirm}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

import { Fragment } from "react";
import { RiLightbulbLine } from "react-icons/ri";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void | (() => Promise<void>);
  children: React.ReactNode;
  actionsButtons?: ActionButton[];
}

export interface ActionButton {
  label: string;
  onClick: (() => Promise<void>) | ((e: any) => Promise<void>) | (() => void);
  className?: string;
  condition: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  actionsButtons,
}) => {
  const styles = {};
  return (
    <div
      className={`modal-container grid place-content-center w-full h-full overflow-hidden fixed top-0 left-0 ${
        isOpen ? "grid" : "hidden"
      } `}
    >
      <div
        className="modal-overlay bg-zinc-400 opacity-40 h-screen w-screen fixed top-0 left-0 z-0 overflow-hidden"
        onClick={onClose}
      ></div>
      <div className="modal bg-white w-auto h-auto z-50 overflow-hidden shadow-lg rounded-md">
        <div className="modal-header px-4 py-2 border-b flex flex-row gap-2 items-center">
          <RiLightbulbLine size={34} className="text-cyan-600" />
          <h2 className="text-2xl">{title}</h2>
        </div>
        <div className="modal-content overflow-y-auto p-4 relative">
          {children}
        </div>
        {actionsButtons ? (
          <div className="modal-footer flex justify-end px-4 py-2 border-t gap-2">
            {actionsButtons.map((actionButton: ActionButton, index) => (
              <Fragment key={index}>
                {actionButton.condition ? (
                  <button
                    className={`${
                      actionButton.className
                        ? actionButton.className
                        : "bg-cyan-600 hover:bg-cyan-700 rounded px-4 py-2 text-white"
                    }`}
                    onClick={actionButton.onClick}
                  >
                    {actionButton.label}
                  </button>
                ) : null}
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="modal-footer flex justify-end px-4 py-2 border-t">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 rounded px-4 py-2 text-white"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

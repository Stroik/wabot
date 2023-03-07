import { Tooltip as ReactTooltip } from "react-tooltip";
import { Fragment } from "react";

interface Buttons {
  icon: JSX.Element;
  onClick: (id: string) => void;
  label?: string;
  style: string;
  show: boolean;
}

interface CardProps {
  title: string;
  buttons: Array<Buttons>;
  children: React.ReactNode;
  id: string;
  status?: React.ReactNode;
}

export default function Card({
  title,
  status,
  buttons,
  children,
  id,
}: CardProps) {
  return (
    <div className="card flex flex-col w-full  text-white rounded aspect-square">
      <div className="card-header flex items-center justify-between bg-cyan-900 py-4 rounded-t">
        <h3 className="card-title mx-2">{title}</h3>
        <span className="card-status mx-2">{status}</span>
      </div>
      <div className="card-content grid place-content-center text-zinc-900 border-l border-r h-full bg-white">
        {children}
      </div>
      <div
        className={`card-footer bg-cyan-700 py-4 grid grid-cols-${buttons.length} gap-2 rounded-b place-content-between px-2`}
      >
        {buttons.map(({ icon, label, onClick, style, show, ...rest }, i) => {
          return (
            <Fragment key={i}>
              {show && (
                <button
                  className={`rounded py-2 px-4 w-full flex tool-tip justify-center ${style}`}
                  onClick={() => onClick(id)}
                  {...rest}
                >
                  {icon}
                  {label && label.length > 0 && (
                    <span className="ml-2">{label}</span>
                  )}
                </button>
              )}
            </Fragment>
          );
        })}
      </div>
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </div>
  );
}

import { RiInformationFill } from "react-icons/ri";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useEffect } from "react";

interface Props {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<any>>;
  vars: string[];
  label: string;
  name: string;
  className?: string;
}

export default function MessageWithVars({
  message,
  setMessage,
  vars,
  label,
  name,
  className,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="vars">
        {vars && vars.length ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <h2 className="text-xl">Variables</h2>
              <RiInformationFill
                size={24}
                className="inline-block text-sky-500 cursor-pointer tool-tip"
                data-tooltip-content="Las variables reemplazaran por cada dato correspondiente cargada en la agenda"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {vars.map((v) => (
                <span
                  key={v}
                  className="bg-sky-400 px-2 py-1 rounded cursor-pointer text-center text-white"
                  onClick={() => {
                    setMessage((prev: any) => {
                      return {
                        ...prev,
                        message: `${prev.message}${v}`,
                      };
                    });
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor={name}>{label}</label>
        <textarea
          name={name}
          id={name}
          className={`${
            className ? className : ""
          } rounded p-2 border resize-none`}
          defaultValue={message}
          onChange={({ target: { value } }) => {
            setMessage((prev: any) => {
              return {
                ...prev,
                [name]: value,
              };
            });
          }}
        ></textarea>
      </div>
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </div>
  );
}

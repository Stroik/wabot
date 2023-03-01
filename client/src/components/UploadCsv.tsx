import {
  Dispatch,
  ChangeEvent,
  FC,
  SetStateAction,
  useState,
  useRef,
} from "react";
import { csvToArray } from "../utils/csvToArray";
import { RiFileUploadLine } from "react-icons/ri";

const LABELS: [string, string] = ["Base de datos", "Subir Base de datos"];

interface Props {
  setState: Dispatch<SetStateAction<any>>;
  labels?: string[];
  disabled?: boolean;
}

const UploadCsv: FC<Props> = ({ setState, disabled, labels }) => {
  const [filename, setFilename] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);
  let Labels = labels ? labels : LABELS;

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFilename(file.name);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csv = e.target && e.target.result;
      if (csv) {
        let csvToRead = csv?.toString();
        let csvArray = csvToArray(csvToRead);
        setState(csvArray);
      } else {
        console.log("Error reading csv");
      }
    };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };
  return (
    <div
      className="flex justify-center w-full relative"
      onDragEnter={handleDrag}
    >
      <label
        htmlFor="file"
        className={`${
          dragActive ? "border-dashed border-4 border-zinc-400 bg-cyan-600" : ""
        } ${
          filename === "" ? "" : "bg-cyan-700"
        } flex flex-row items-center justify-center bg-cyan-500 hover:opacity-90 text-zinc-100 py-2 px-4 rounded cursor-pointer w-full disabled:bg-zinc-400`}
        aria-disabled={disabled}
      >
        <div className="flex flex-col items-center">
          <RiFileUploadLine size={32} />
          <span className="text-base">
            {filename !== "" ? Labels[0] : Labels[1]}
          </span>
          <span className="pt-1 font-bold">{filename}</span>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          className="absolute top-0 left-0 w-full h-full bg-cyan-500 opacity-50"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
      <input
        id="file"
        type="file"
        onChange={handleChange}
        accept=".csv"
        className="hidden"
        disabled={disabled}
        ref={inputRef}
      />
    </div>
  );
};

export default UploadCsv;

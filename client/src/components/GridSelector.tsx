import { useState, useEffect, useRef } from "react";
import { RiMenuFill } from "react-icons/ri";
import useOutsideAlerter from "../hooks/useOutsideAlerter";

interface GridSelectorProps {
  grid: string;
  setGrid: (grid: string) => void;
}

export default function GridSelector({ grid, setGrid }: GridSelectorProps) {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  useOutsideAlerter(wrapperRef, setIsOpen);

  const selectGrid = (grid: string) => {
    switch (grid) {
      case "1":
        return "grid-cols-1";
      case "2":
        return "grid-cols-2";
      case "3":
        return "grid-cols-3";
      case "4":
        return "grid-cols-4";
      case "5":
        return "grid-cols-5";
      case "6":
        return "grid-cols-6";
      default:
        return "grid-cols-3";
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleGrid = (grid: string) => {
    let selectedGrid = selectGrid(grid);
    setGrid(selectedGrid);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center justify-center w-10 h-10 text-gray-100 bg-cyan-400 rounded hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
      >
        <span className="sr-only">Columnas</span>
        <RiMenuFill size={20} />
      </button>
      <div
        className={`absolute right-0 top-11 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <button
            onClick={() => handleGrid("1")}
            className={`${
              grid === "grid-cols-1" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            1 columna
          </button>
          <button
            onClick={() => handleGrid("2")}
            className={`${
              grid === "grid-cols-2" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            2 columnas
          </button>
          <button
            onClick={() => handleGrid("3")}
            className={`${
              grid === "grid-cols-3" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            3 columnas
          </button>
          <button
            onClick={() => handleGrid("4")}
            className={`${
              grid === "grid-cols-4" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            4 columnas
          </button>
          <button
            onClick={() => handleGrid("5")}
            className={`${
              grid === "grid-cols-5" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            5 columnas
          </button>
          <button
            onClick={() => handleGrid("6")}
            className={`${
              grid === "grid-cols-6" ? "bg-gray-100" : ""
            } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
          >
            6 columnas
          </button>
        </div>
      </div>
    </div>
  );
}

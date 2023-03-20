import React from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Select: React.FC<Props> = ({
  label,
  name,
  options,
  value,
  onChange,
  className,
}) => (
  <div className={`${className ? className : ""} mb-4`}>
    <label className="block text-gray-700 font-bold mb-2" htmlFor={name}>
      {label}
    </label>
    <select
      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;

import React from "react";

export interface Option {
  label: string;
  value: string;
  name?: string;
  _id?: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[] | (() => Option[]);
  value?: string | string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
  rest?: any;
}

const Select: React.FC<Props> = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  className,
  ...rest
}) => {
  const optionsArray = typeof options === "function" ? options() : options;
  return (
    <div className={`${className ? className : ""} mb-4`}>
      <label className="block text-gray-700 font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <select
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        name={name}
        defaultValue={value ? value : "default"}
        onChange={onChange}
        {...rest}
      >
        <option disabled value="default" className="pb-2">
          {placeholder ? placeholder : "Seleccione una opción"}
        </option>
        {optionsArray && optionsArray.length > 0
          ? optionsArray.map((option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : null}
      </select>
    </div>
  );
};

export default Select;

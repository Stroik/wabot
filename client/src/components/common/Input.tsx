import React, { forwardRef, Ref } from "react";

interface InputWithRefProps {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
}

const InputWithRef = forwardRef<HTMLInputElement, InputWithRefProps>(
  (
    {
      label,
      name,
      placeholder,
      required,
      type,
      onChange,
      value,
      className,
      inputRef,
    },
    ref
  ) => {
    return (
      <div className={`${className ? className : ""} mb-4`}>
        <label className="block text-gray-700 font-bold mb-2" htmlFor={name}>
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
);

interface InputWithStateProps {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
}

const InputWithState = ({
  label,
  name,
  placeholder,
  required,
  type,
  onChange,
  value,
  className,
}: InputWithStateProps) => {
  return (
    <div className={`${className ? className : ""} mb-4`}>
      <label className="block text-gray-700 font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

interface InputProps extends InputWithRefProps, InputWithStateProps {}

const Input = ({
  label,
  name,
  placeholder,
  required,
  type,
  onChange,
  value,
  className,
  inputRef,
}: InputProps) => {
  if (inputRef) {
    return (
      <InputWithRef
        label={label}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        onChange={onChange}
        value={value}
        className={className}
        inputRef={inputRef}
      />
    );
  } else {
    return (
      <InputWithState
        label={label}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        onChange={onChange}
        value={value}
        className={className}
      />
    );
  }
};

export default Input;

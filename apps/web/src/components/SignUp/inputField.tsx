type InputFieldProps = {
  type: string;
  htmlFor: string;
  text: string;
  placeholder: string;
  error: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const InputField = ({
  type,
  htmlFor,
  text,
  placeholder,
  error,
  value,
  onChange,
  name
}: InputFieldProps) => (
  <div className="input-group ">
    <label
      htmlFor={htmlFor}
      className="input-label block text-sm font-semibold text-gray-700  mb-1"
    >
      {text}
    </label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      id={htmlFor}
      name={name}
      className="w-full px-3 py-2.5 mb-1 border-2 border-gray-300 text-gray-500 bg-white rounded focus:border-blue-500 focus:outline-none text-black"
      placeholder={placeholder}
    />
    <p className="text-red-500 mb-2.5 errMsg">{error && <span>{error} </span>}</p>
  </div>
);

export default InputField;

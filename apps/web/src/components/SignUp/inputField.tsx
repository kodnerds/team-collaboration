type InputFieldProps = {
  type: string;
  id: string;
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
  id,
  htmlFor,
  text,
  placeholder,
  error,
  value,
  onChange,
  name
}: InputFieldProps) => (
  <div className="input-group">
    <label htmlFor={htmlFor} className="input-label">
      {text}
    </label>
    <input
      value={value}
      onChange={onChange}
      type={type}
      id={id}
      name={name}
      className="input-field"
      placeholder={placeholder}
    />
    <p className="errorMsg">{error && <span>{error} </span>}</p>
 
  </div>
);

export default InputField;

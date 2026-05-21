interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
}

export function InputText({ labelText = "", ...props }: InputTextProps) {
  return (
    <label htmlFor={props.id}>
      {labelText && <p>{labelText}</p>}
      <input
        id={props.id}
        {...props}
        className="w-full bg-blue-300 outline-2 outline-blue-700 rounded-sm my-2 p-1"
      />
    </label>
  );
}

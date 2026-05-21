interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string;
}

export function Button({ buttonText, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="cursor-pointer border-2 border-blue-700 rounded-md px-2 py-1 hover:bg-blue-300 transition-colors"
    >
      {buttonText}
    </button>
  );
}

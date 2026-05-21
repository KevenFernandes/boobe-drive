type ContainerAuthProps = {
  children: React.ReactNode;
};

export function ContainerAuth({ children }: ContainerAuthProps) {
  return (
    <div className="w-full min-h-screen bg-gray-900 overflow-hidden flex text-black">
      <div className="bg-white mx-auto min-w-100 my-70 rounded-md">
        {children}
      </div>
    </div>
  );
}

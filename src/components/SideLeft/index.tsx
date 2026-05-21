import { PlusCircleIcon } from "lucide-react";
import { LogoIcon } from "../Logo";

export function SideLeft() {
  return (
    <aside className="p-2 flex flex-col gap-5 bg-blue-300/30 rounded-2xl">
      <div className="flex items-center gap-2 py-2 px-4">
        <LogoIcon />
        <div>Boobe Drive</div>
      </div>
      <button className="flex w-full items-center justify-between p-2 gap-2 bg-white text-blue-950 rounded-lg font-bold cursor-pointer">
        criar <PlusCircleIcon size={20} />
      </button>
    </aside>
  );
}

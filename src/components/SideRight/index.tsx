import { UserCircleIcon } from "lucide-react";

export function SideRight() {
  return (
    <aside className="w-15 bg-blue-300/30 flex justify-center py-4 rounded-2xl">
      <div>
        <button>
          <UserCircleIcon />
        </button>
      </div>
    </aside>
  );
}

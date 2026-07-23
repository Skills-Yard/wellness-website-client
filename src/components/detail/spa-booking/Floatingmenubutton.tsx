import { Menu as MenuIcon } from "lucide-react";

interface FloatingMenuButtonProps {
  isCartOpen: boolean;
  onClick: () => void;
}

export default function FloatingMenuButton({
  isCartOpen,
  onClick,
}: FloatingMenuButtonProps) {
  if (isCartOpen) return null;

  return (
    <div className="lg:hidden w-full fixed bottom-8 z-60 flex justify-center px-3 xs:px-4">
      <button
        onClick={onClick}
        className="flex text-sm xs:text-base mx-auto items-center gap-2 bg-[#25180F] text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-xl font-bold shadow-xl shadow-black/20 active:scale-95 transition-transform whitespace-nowrap"
      >
        <MenuIcon className="w-4 h-4 shrink-0" />
        Menu
      </button>
    </div>
  );
}
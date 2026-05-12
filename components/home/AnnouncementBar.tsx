import { ChevronDown } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-[#F3F4F6] h-9 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <button className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827] transition">
        Čeština <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <span className="text-sm text-[#111827]">
        Doprava zdarma při objednávce nad 2&nbsp;000&nbsp;Kč
      </span>
      <div className="flex items-center gap-3">
        {["F", "T", "I", "P"].map((letter) => (
          <span
            key={letter}
            className="w-5 h-5 flex items-center justify-center text-xs font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer transition"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

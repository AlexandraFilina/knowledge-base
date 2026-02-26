import { useState, KeyboardEvent, useEffect } from "react";

export interface IChipsInputProps {
  defaultChips: string[];
  onChange: (value: string[]) => void;
}

export default function ChipsInput({
  defaultChips,
  onChange,
}: IChipsInputProps) {
  const [chips, setChips] = useState(defaultChips || []);
  const [chipValue, setChipValue] = useState("");

  useEffect(() => {
    onChange(chips);
  }, [chips]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip();
    }
  };

  const addChip = () => {
    const trimmedInput = chipValue.trim().replace(/,/g, "");
    if (trimmedInput && !chips.includes(trimmedInput)) {
      setChips([...chips, trimmedInput]);
      setChipValue("");
    }
  };

  const removeChip = (chipToRemove: string) => {
    setChips([...chips.filter((t) => t !== chipToRemove)]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-full p-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 focus-within:ring-2 focus-within:ring-rose-500 focus-within:bg-white transition-all">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm"
            >
              {chip}
              <button
                type="button"
                onClick={() => removeChip(chip)}
                className="hover:bg-rose-700 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[14px]"
              >
                ×
              </button>
            </span>
          ))}

          <input
            type="text"
            value={chipValue}
            onChange={(e) => setChipValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addChip}
            placeholder={chips.length === 0 ? "Type and press Enter..." : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-stone-700"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Chọn sản phẩm",
}: {
  options: { id: string | number; name: string }[];
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.id === value);

  return (
    <div className="relative w-full">
      <div className="h-11 w-full border rounded-md px-3 flex items-center justify-between cursor-pointer dark:bg-gray-800 dark:text-white" onClick={() => setOpen((prev) => !prev)}>
        <span>{selectedOption?.name || placeholder}</span>
        <svg className={`w-4 h-4 ml-2 transform transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <ul className="absolute z-10 mt-1 w-full max-h-40 overflow-auto border bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-md">
          {options.map((option) => (
            <li
              key={option.id}
              className={`px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${option.id === value ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              onClick={() => {
                onChange(String(option.id));
                setOpen(false);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

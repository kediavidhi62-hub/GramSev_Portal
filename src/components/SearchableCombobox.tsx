import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface SearchableComboboxProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync value changes with search term
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset search term to selected value or empty if none selected
        setSearchTerm(value || "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value]);

  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelectOption = (option: string) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-1 text-left font-sans">
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`relative flex items-center w-full bg-slate-50 border rounded-xl py-0.5 px-3 transition-all duration-150 ${
            disabled
              ? "opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed"
              : isOpen
              ? "border-orange-500 ring-2 ring-orange-500/10 bg-white"
              : "border-slate-200 hover:border-slate-300 bg-slate-50"
          }`}
        >
          {/* Magnifying search icon */}
          <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
          
          <input
            type="text"
            disabled={disabled}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            placeholder={placeholder}
            onFocus={() => !disabled && setIsOpen(true)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 py-2.5 text-xs font-medium focus:outline-none focus:ring-0"
          />

          <div className="flex items-center space-x-1 shrink-0 ml-1.5">
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition"
                title="Clear selection"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "transform rotate-180 text-orange-500" : ""}`} />
          </div>
        </div>

        {/* Dropdown popup */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto animate-fadeIn divide-y divide-slate-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = value === option;
                return (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors duration-100 ${
                      isSelected
                        ? "bg-orange-50 text-orange-850 hover:bg-orange-100/60"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-orange-600 font-bold shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-3 text-slate-400 text-xs text-center font-medium italic">
                No matching results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

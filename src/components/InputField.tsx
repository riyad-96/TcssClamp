import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

type InputFieldPropsTypes = {
  id: string;
  label: string;
  name: string;
  className?: string;
  placeholder: string;
};

export default function Input({
  id,
  label,
  name,
  className,
  placeholder,
}: InputFieldPropsTypes) {
  const input = useRef<HTMLInputElement>(null);
  const changeUnitValue = (value: string) => {
    const currentInputValue = parseFloat(input.current?.value as string);
    if (!input.current) return;

    if (value === 'rem') {
      input.current.value = String(currentInputValue / 16);
      input.current.setAttribute('data-unit', 'rem');
    } else {
      input.current.value = String(currentInputValue * 16);
      input.current.setAttribute('data-unit', 'px');
    }
  };

  return (
    <div className="grid gap-1">
      <label className="w-fit pl-0.5" htmlFor={id}>
        {label}
      </label>
      <div className="relative rounded-md border border-zinc-300 px-3 ring-0 ring-(--ring-clr) transition-shadow focus-within:border-(--ring-clr) focus-within:ring-2">
        <input
          data-unit="px"
          ref={input}
          id={id}
          type="number"
          name={name}
          placeholder={placeholder}
          step="any"
          className={`w-full min-w-0 py-1.5 pr-17 transition-shadow outline-none ${className}`}
        />
        <div className="absolute top-1/2 right-0 z-5 flex h-full -translate-y-1/2 items-center pr-1.5">
          <select
            onChange={(e) => changeUnitValue(e.target.value)}
            className="rounded-sm py-1 pr-5 pl-1.5 text-sm transition-[background-color] duration-150 outline-none pointer-coarse:bg-zinc-100 pointer-fine:hover:bg-zinc-100 pointer-fine:focus:bg-zinc-100"
          >
            <option value="px">PX</option>
            <option value="rem">REM</option>
          </select>

          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2">
            <ChevronDown size="14" />
          </span>
        </div>
      </div>
    </div>
  );
}

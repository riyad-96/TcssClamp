import { toast, Tooltip } from 'kitzo/react';
import kitzo from 'kitzo';
import { Book, BookMarked, Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import type { GenerateClampSizeProps } from '../App';

export type ClampDisplayProps = {
  content: string;
  name: string;
  unit: string;
  prefix: string;
  input_values: GenerateClampSizeProps;
};

export default function ClampDisplay({
  content,
  name,
  unit,
  prefix,
  input_values,
}: ClampDisplayProps) {
  const [copied, setCopied] = useState(false);

  const [saved, setSaved] = useState(() => {
    const savedData: ClampDisplayProps[] =
      JSON.parse(localStorage.getItem('saved-clamps') as string) || [];
    const exists = savedData.find((d) => d.content === content);
    return exists ? true : false;
  });

  function saveClampData(data: ClampDisplayProps) {
    const savedData: ClampDisplayProps[] =
      JSON.parse(localStorage.getItem('saved-clamps') as string) || [];

    const exists = savedData.find((d) => d.content === data.content);
    if (exists) {
      toast.error('Clamp already saved!');
      return;
    }

    savedData.push(data);
    localStorage.setItem('saved-clamps', JSON.stringify(savedData));
    setSaved(true);
    toast.success('Clamp saved');
  }

  return (
    <div className="group relative rounded-lg bg-zinc-100 px-4 py-3">
      <div>
        <div className="mb-2 flex items-center gap-1">
          <span className="font-semibold">{name}</span>
          <span className="rounded-md bg-zinc-200 px-1.5 code-font text-sm tracking-wide">
            {unit}
          </span>
          <span className="font-semibold">:</span>
        </div>
        <p className="code-font break-all">
          <span className="font-medium">{prefix}</span>
          {content}
        </p>
      </div>

      <div className="absolute top-1.5 right-1.5 flex gap-2">
        <Tooltip content={saved ? 'Saved' : 'Save'}>
          <button
            onClick={() => {
              saveClampData({ name, content, prefix, unit, input_values });
            }}
            className="group-hover: grid size-[30px] transform-gpu place-items-center rounded-md bg-white shadow-sm transition-[opacity,scale] pointer-fine:scale-80 pointer-fine:opacity-0 pointer-fine:group-hover:scale-100 pointer-fine:group-hover:opacity-100"
          >
            {saved ? (
              <span>
                <BookMarked size="18" />
              </span>
            ) : (
              <span>
                <Book size="18" />
              </span>
            )}
          </button>
        </Tooltip>

        <Tooltip content={copied ? 'Copied' : 'Copy'}>
          <button
            onClick={() => {
              if (copied) return;
              kitzo.copy(prefix + content);
              setCopied(true);
              toast.success('Clamp copied');
              setTimeout(() => setCopied(false), 2000);
            }}
            className="group-hover: grid size-[30px] transform-gpu place-items-center rounded-md bg-white shadow-sm transition-[opacity,scale] pointer-fine:scale-80 pointer-fine:opacity-0 pointer-fine:group-hover:scale-100 pointer-fine:group-hover:opacity-100"
          >
            {copied ? (
              <span>
                <ClipboardCheck size="18" />
              </span>
            ) : (
              <span>
                <Clipboard size="18" />
              </span>
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

import { Tooltip } from 'kitzo/react';
import kitzo from 'kitzo';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

type ClampDisplayProps = {
  content: string;
  name: string;
  unit: string;
  prefix: string;
};

export default function ClampDisplay({
  content,
  name,
  unit,
  prefix,
}: ClampDisplayProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative rounded-lg bg-zinc-100 px-4 py-3">
      <div>
        <div className="mb-2 flex items-center gap-1">
          <span className="font-semibold">{name}</span>
          <span className="rounded-md bg-zinc-200 px-1.5 font-[fira-code] text-sm tracking-wide">
            {unit}
          </span>
          <span className="font-semibold">:</span>
        </div>
        <p className="font-[fira_code] break-all">
          <span className="font-medium">{prefix}</span>
          {content}
        </p>
      </div>

      <div className="absolute top-1.5 right-1.5">
        <Tooltip content={copied ? 'Copied' : 'Copy'}>
          <button
            onClick={() => {
              if (copied) return;
              kitzo.copy(prefix + content);
              setCopied(true);
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

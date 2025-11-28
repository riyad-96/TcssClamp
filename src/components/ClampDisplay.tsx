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
    <div className="relative rounded-lg bg-white px-4 py-3 shadow-sm">
      <div>
        <div className="flex items-center gap-1 font-medium">
          <span>{name}</span>
          <span className="rounded-md bg-zinc-200 px-1.5 font-[fira-code] text-sm tracking-wide">
            {unit}
          </span>
          :
        </div>
        <p className="font-[fira_code] break-all">{prefix + content}</p>
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
            className="grid size-[30px] place-items-center rounded-md border border-zinc-200 bg-zinc-100"
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

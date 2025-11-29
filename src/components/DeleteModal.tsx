import { toast } from 'kitzo/react';
import { motion } from 'motion/react';
import type { ClampDisplayProps } from './ClampDisplay';

type DeleteModalProps = {
  setSavedData: React.Dispatch<React.SetStateAction<ClampDisplayProps[]>>;
  setDeleting: React.Dispatch<React.SetStateAction<string | null>>;
  content: string | null;
};

export default function DeleteModal({
  setSavedData,
  setDeleting,
  content,
}: DeleteModalProps) {
  const deleteClamp = () => {
    const savedData: ClampDisplayProps[] = JSON.parse(
      localStorage.getItem('saved-clamps') as string,
    );
    localStorage.setItem(
      'saved-clamps',
      JSON.stringify(savedData.filter((d) => d.content !== content)),
    );
    setSavedData((prev) => prev.filter((d) => d.content !== content));
    setDeleting(null);
    toast.success('Clamp removed');
  };

  return (
    <motion.div
      onMouseDown={() => setDeleting(null)}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 grid place-items-center overflow-x-hidden overflow-y-auto bg-black/30 p-4"
    >
      <motion.div
        onMouseDown={(e) => e.stopPropagation()}
        initial={{
          scale: 1.2,
        }}
        animate={{
          scale: 1,
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
        }}
        className="w-full max-w-[450px] rounded-xl bg-white p-4 shadow-md"
      >
        <h5 className="text-lg font-medium">Delete this clamp?</h5>
        <p className="code-font break-all" >{content}</p>

        <div className="mt-4 flex justify-end gap-1">
          <button
            onClick={() => setDeleting(null)}
            className="rounded-full bg-zinc-200 px-3 py-1 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={deleteClamp}
            className="rounded-full bg-red-300 px-3 py-1 text-sm"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

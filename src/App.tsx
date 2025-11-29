import { useMemo, useRef, useState } from 'react';
import InputField from './components/InputField';
import ClampDisplay from './components/ClampDisplay';
import { AnimatePresence } from 'motion/react';
import LocalDataViewModal from './components/LocalDataViewModal';
import { BookMarked } from 'lucide-react';
import { ToastContainer, Tooltip } from 'kitzo/react';

export type GenerateClampSizeProps = {
  min_viewport_width: number;
  max_viewport_width: number;
  min_size: number;
  max_size: number;
};

type FinalSizes = {
  min: number;
  max: number;
  slopeVw: number;
  interceptPx: number;
  input_values: GenerateClampSizeProps;
};

export default function App() {
  const [finalSizes, setFinalSizes] = useState<FinalSizes | null>(null);
  const [prefix, setPrefix] = useState('');
  const formSubmitBtn = useRef<HTMLButtonElement>(null);

  const display = useMemo(() => {
    if (!finalSizes) return null;

    const f = (num: number) => parseFloat(num.toFixed(4));

    const normalPx = `clamp(${f(finalSizes.min)}px, ${f(finalSizes.interceptPx)}px + ${f(finalSizes.slopeVw)}vw, ${f(finalSizes.max)}px)`;
    const normalRem = `clamp(${f(finalSizes.min / 16)}rem, ${f(finalSizes.interceptPx / 16)}rem + ${f(finalSizes.slopeVw)}vw, ${f(finalSizes.max / 16)}rem)`;

    const tailwindcssPx = `clamp(${f(finalSizes.min)}px,${f(finalSizes.interceptPx)}px+${f(finalSizes.slopeVw)}vw,${f(finalSizes.max)}px)`;
    const tailwindcssRem = `clamp(${f(finalSizes.min / 16)}rem,${f(finalSizes.interceptPx / 16)}rem+${f(finalSizes.slopeVw)}vw,${f(finalSizes.max / 16)}rem)`;

    return {
      normal: {
        px: normalPx,
        rem: normalRem,
      },
      tailwindcss: {
        px: tailwindcssPx,
        rem: tailwindcssRem,
      },
      input_values: finalSizes.input_values,
    };
  }, [finalSizes]);

  // generate clamp sizes
  function generateClampSize({
    min_viewport_width,
    max_viewport_width,
    min_size,
    max_size,
  }: GenerateClampSizeProps) {
    const slopeVw =
      ((max_size - min_size) / (max_viewport_width - min_viewport_width)) * 100;
    const interceptPx = min_size - slopeVw * (min_viewport_width / 100);

    setFinalSizes({
      min: min_size,
      max: max_size,
      slopeVw,
      interceptPx,
      input_values: {
        max_viewport_width,
        min_viewport_width,
        min_size,
        max_size,
      },
    });
  }

  // trigger function
  function submitForm(form: HTMLFormElement) {
    const min_viewport_unit = form.min_viewport_width.dataset.unit;
    const max_viewport_unit = form.max_viewport_width.dataset.unit;
    const min_size_unit = form.min_size.dataset.unit;
    const max_size_unit = form.max_size.dataset.unit;

    let min_viewport_width = parseFloat(form.min_viewport_width.value);
    let max_viewport_width = parseFloat(form.max_viewport_width.value);
    let min_size = parseFloat(form.min_size.value);
    let max_size = parseFloat(form.max_size.value);

    if (min_viewport_unit === 'rem')
      min_viewport_width = min_viewport_width * 16;
    if (max_viewport_unit === 'rem')
      max_viewport_width = max_viewport_width * 16;
    if (min_size_unit === 'rem') min_size = min_size * 16;
    if (max_size_unit === 'rem') max_size = max_size * 16;

    if (min_viewport_width >= max_viewport_width) return setFinalSizes(null);
    if (min_size >= max_size) return setFinalSizes(null);

    if (
      isNaN(min_viewport_width) ||
      isNaN(max_viewport_width) ||
      isNaN(min_size) ||
      isNaN(max_size)
    ) {
      setFinalSizes(null);
      return;
    }

    generateClampSize({
      min_viewport_width,
      max_viewport_width,
      min_size,
      max_size,
    });
  }

  const [modal, setModal] = useState(false);

  return (
    <main className="height-screen overflow-y-auto bg-(--main-bg-clr) px-4 pt-20 pb-26">
      <div className="fixed top-2 left-2 z-10">
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-white/80 px-2 py-1 text-xl font-semibold backdrop-blur-xs"
        >
          KitzoClamp
        </button>
      </div>

      <div className="w-full max-w-[600px] mx-auto">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-bold">CSS Clamp Generator</h1>
          <p className="font-light tracking-wide opacity-80">
            Generate smooth, responsive values
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm(e.target as HTMLFormElement);
          }}
          onChange={() => formSubmitBtn.current?.click()}
        >
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 sm:gap-y-4">
            <InputField
              id="min_viewport_width"
              label="Minimum viewport size"
              name="min_viewport_width"
              placeholder="Viewport size"
            />
            <InputField
              id="max_viewport_width"
              label="Maximum viewport size"
              name="max_viewport_width"
              placeholder="Viewport size"
            />
            <InputField
              id="min_size"
              label="Minimum size"
              name="min_size"
              placeholder="Minimum size"
            />
            <InputField
              id="max_size"
              label="Maximum size"
              name="max_size"
              placeholder="Maximum size"
            />
          </div>

          <div className="">
            <button
              ref={formSubmitBtn}
              type="submit"
              className="hidden"
            ></button>
          </div>
        </form>

        <div className="my-8 ml-auto w-fit">
          <Tooltip
            content="View saved clamps"
            tooltipOptions={{ position: 'left' }}
          >
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1.5 text-sm"
            >
              <BookMarked size="14" />
              <span className="pointer-fine:hidden">View saved</span>
            </button>
          </Tooltip>
        </div>

        <div>
          {finalSizes && display ? (
            <>
              <h2 className="text-center text-xl font-semibold">
                Generated sizes:
              </h2>
              <div className="mt-4">
                <div className="mb-2 w-fit rounded-md bg-zinc-100 px-2 inset-shadow-xs">
                  <label htmlFor="prefix">Prefix: </label>
                  <input
                    id="prefix"
                    className="px-2 py-1.5 outline-none"
                    type="text"
                    onChange={(e) => setPrefix(e.target.value)}
                    value={prefix}
                    placeholder="Add prefix"
                  />
                </div>

                <div className="grid gap-2">
                  <ClampDisplay
                    name="CSS"
                    unit="px"
                    content={display.normal.px}
                    prefix={prefix}
                    input_values={display.input_values}
                  />

                  <ClampDisplay
                    name="CSS"
                    unit="rem"
                    content={display.normal.rem}
                    prefix={prefix}
                    input_values={display.input_values}
                  />
                  <ClampDisplay
                    name="Tailwindcss"
                    unit="px"
                    content={display.tailwindcss.px}
                    prefix={prefix}
                    input_values={display.input_values}
                  />
                  <ClampDisplay
                    name="Tailwindcss"
                    unit="rem"
                    content={display.tailwindcss.rem}
                    prefix={prefix}
                    input_values={display.input_values}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mx-auto mt-4 w-fit rounded-xl px-4 py-1 text-center text-sm font-light tracking-wide opacity-80">
                Generated clamp sizes will appear here.
              </p>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && <LocalDataViewModal setModal={setModal} />}
      </AnimatePresence>

      <ToastContainer />
    </main>
  );
}

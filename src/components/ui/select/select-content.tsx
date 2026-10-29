import type { Handle } from "remix/component";
import * as popover from "@remix-run/ui/popover";
import * as select from "@remix-run/ui/select";
import { Icon } from "@/components/icon";
import type { SelectOption } from "./types";

interface Props {
  label: string;
  options: SelectOption[];
}

export function SelectContent(handle: Handle<Props>) {
  return () => (
    <popover.Context>
      {/* Fade only: transforms would skew the measurements the primitive uses to
          place the selected option over the trigger. */}
      <div
        class="m-0 max-w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-1.5 font-sans text-ink opacity-0 shadow-2xl shadow-stone-900/15 transition-[opacity,display,overlay] transition-discrete duration-150 ease-out open:opacity-100 starting:open:opacity-0"
        mix={select.popover()}
      >
        <div
          class="max-h-72 scroll-py-1 space-y-0.5 overflow-y-auto overscroll-contain outline-none"
          aria-label={`${handle.props.label} options`}
          mix={select.list()}
        >
          {handle.props.options.map((option) => (
            <div
              key={option.value}
              class="group/option flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm select-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 data-select-flash:bg-forest-soft data-[highlighted=true]:bg-ink/5"
              mix={select.option({
                value: option.value,
                label: option.label,
                disabled: option.disabled,
              })}
            >
              <span class="min-w-0 flex-1">
                <span class="block font-medium group-aria-selected/option:text-forest">
                  {option.label}
                </span>
                {option.description ? (
                  <span class="mt-0.5 block max-w-64 text-xs leading-relaxed text-stone-500">
                    {option.description}
                  </span>
                ) : null}
              </span>
              {option.meta ? (
                <span class="text-xs text-stone-400 tabular-nums">
                  {option.meta}
                </span>
              ) : null}
              <Icon
                name="check"
                class="size-4 shrink-0 text-forest opacity-0 group-aria-selected/option:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </popover.Context>
  );
}

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
      <div
        class="m-0 max-w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-stone-200 bg-white p-1.5 font-sans text-ink shadow-xl shadow-stone-900/10"
        mix={select.popover()}
      >
        <div
          class="max-h-72 space-y-0.5 overflow-y-auto overscroll-contain outline-none"
          aria-label={`${handle.props.label} options`}
          mix={select.list()}
        >
          {handle.props.options.map((option) => (
            <div
              key={option.value}
              class="group/option flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] select-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-selected:bg-emerald-50/70 aria-selected:text-emerald-900 data-select-flash:bg-emerald-100 data-[highlighted=true]:bg-emerald-100/70"
              mix={select.option({
                value: option.value,
                label: option.label,
                disabled: option.disabled,
              })}
            >
              <span class="min-w-0 flex-1">
                <span class="block font-medium">{option.label}</span>
                {option.description ? (
                  <span class="mt-0.5 block max-w-64 text-[11px] leading-relaxed text-stone-500">
                    {option.description}
                  </span>
                ) : null}
              </span>
              {option.meta ? (
                <span class="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 tabular-nums">
                  {option.meta}
                </span>
              ) : null}
              <Icon
                name="check"
                class="size-3.5 shrink-0 text-emerald-800 opacity-0 group-aria-selected/option:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </popover.Context>
  );
}

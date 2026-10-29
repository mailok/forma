import { on, type Handle } from "remix/component";
import { Icon } from "@/components/icon";

interface Props {
  checked: boolean;
  onCheckedChange(checked: boolean): void;
  name?: string;
  value?: string;
  disabled?: boolean;
}

export function Checkbox(handle: Handle<Props>) {
  return () => (
    <span class="relative flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        name={handle.props.name}
        value={handle.props.value}
        checked={handle.props.checked}
        disabled={handle.props.disabled}
        class="peer size-4 cursor-pointer appearance-none rounded-sm border border-stone-300 bg-white transition-colors checked:border-emerald-800 checked:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-700 disabled:cursor-not-allowed"
        mix={on("change", (event) =>
          handle.props.onCheckedChange(
            (event.currentTarget as HTMLInputElement).checked,
          ),
        )}
      />
      <Icon
        name="check"
        class="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}

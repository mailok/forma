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
    <span class="relative flex size-4.5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        name={handle.props.name}
        value={handle.props.value}
        checked={handle.props.checked}
        disabled={handle.props.disabled}
        class="peer size-4.5 cursor-pointer appearance-none rounded-[5px] border border-stone-300 bg-paper transition-colors checked:border-ink checked:bg-ink hover:border-stone-400 checked:hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-50"
        mix={on("change", (event) =>
          handle.props.onCheckedChange(
            (event.currentTarget as HTMLInputElement).checked,
          ),
        )}
      />
      <Icon
        name="check"
        class="pointer-events-none absolute size-3 text-paper opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}

import type { Handle } from "remix/component";
import { toggle } from "@remix-run/ui/toggle";

interface Props {
  checked: boolean;
  onCheckedChange(checked: boolean): void;
  name?: string;
}

export function Switch(handle: Handle<Props>) {
  return () => (
    <input
      type="checkbox"
      class="h-5 w-9 cursor-pointer appearance-none rounded-full bg-stone-200 p-0.5 transition-colors before:block before:size-4 before:rounded-full before:bg-white before:shadow-sm before:transition-transform checked:bg-emerald-800 checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-700"
      mix={toggle({
        checked: handle.props.checked,
        name: handle.props.name,
        onCheckedChange: handle.props.onCheckedChange,
      })}
    />
  );
}

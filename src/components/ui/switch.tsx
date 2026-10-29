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
      class="h-6 w-10.5 shrink-0 cursor-pointer appearance-none rounded-full bg-stone-300/70 p-0.5 transition-colors before:block before:size-5 before:rounded-full before:bg-paper before:shadow-sm before:shadow-stone-900/20 before:transition-transform checked:bg-forest checked:before:translate-x-4.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-forest"
      mix={toggle({
        checked: handle.props.checked,
        name: handle.props.name,
        onCheckedChange: handle.props.onCheckedChange,
      })}
    />
  );
}

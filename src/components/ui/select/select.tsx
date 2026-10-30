import type { Handle } from "remix/component";
import { cn } from "@/lib/utils";
import * as select from "@remix-run/ui/select";
import { SelectContent } from "./select-content";
import { SelectTrigger } from "./select-trigger";
import type { SelectOption, SelectVariant } from "./types";

interface Props {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onValueChange(value: string): void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: SelectVariant;
  class?: string;
}

export function Select(handle: Handle<Props>) {
  let appliedValue = handle.props.value;
  let revision = 0;

  return () => {
    const { value, options } = handle.props;
    // The primitive exposes defaultValue, not a controlled value. Reset its context
    // only for external changes (tabs/reset), not for its own committed selection.
    if (value !== appliedValue) {
      appliedValue = value;
      revision += 1;
    }
    const label =
      options.find((option) => option.value === value)?.label ??
      handle.props.placeholder ??
      "Select an option";

    return (
      <div
        class={cn("min-w-0", handle.props.class)}
        mix={select.onSelectChange((event) => {
          if (event.value === null) {
            return;
          }
          appliedValue = event.value;
          handle.props.onValueChange(event.value);
        })}
      >
        <select.Context
          key={revision}
          defaultValue={value}
          defaultLabel={label}
          name={handle.props.name}
          disabled={handle.props.disabled}
          labelSwapDelayMs={0}
        >
          <SelectTrigger
            id={handle.props.id}
            label={handle.props.label}
            variant={handle.props.variant ?? "default"}
          />
          <SelectContent label={handle.props.label} options={options} />
          <input mix={select.hiddenInput()} />
        </select.Context>
      </div>
    );
  };
}

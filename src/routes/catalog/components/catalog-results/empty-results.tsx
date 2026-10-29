import { on, type Handle } from "remix/component";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

interface Props {
  onReset(): void;
}

export function EmptyResults(handle: Handle<Props>) {
  return () => (
    <div class="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70 px-6 text-center">
      <span class="mb-5 flex size-16 items-center justify-center rounded-full bg-[#eef2e9]">
        <Icon name="search" class="size-7 text-[#829774]" />
      </span>
      <h3 class="text-xl font-semibold tracking-tight text-ink">
        No matches this time
      </h3>
      <p class="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
        Try another name or remove a filter. Your next favorite is still waiting
        to be discovered.
      </p>
      <Button
        variant="primary"
        size="lg"
        class="mt-6"
        mix={on("click", () => handle.props.onReset())}
      >
        Back to exploring
      </Button>
    </div>
  );
}

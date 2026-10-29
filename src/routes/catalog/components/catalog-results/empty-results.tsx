import { on, type Handle } from "remix/component";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

interface Props {
  onReset(): void;
}

export function EmptyResults(handle: Handle<Props>) {
  return () => (
    <div class="flex min-h-120 flex-col items-center justify-center rounded-[32px] border border-line bg-paper px-6 py-16 text-center">
      <span class="mb-7 flex size-16 items-center justify-center rounded-full bg-canvas">
        <Icon name="search" class="size-6 text-stone-500" />
      </span>
      <h3 class="text-[28px] leading-tight font-semibold tracking-[-0.025em] text-ink">
        No matches this time
      </h3>
      <p class="mt-4 max-w-sm text-[15px] leading-relaxed text-pretty text-stone-500">
        Try another name or remove a filter. Your next favorite is still waiting
        to be discovered.
      </p>
      <Button
        variant="primary"
        size="lg"
        class="mt-8"
        mix={on("click", () => handle.props.onReset())}
      >
        Back to exploring
      </Button>
    </div>
  );
}

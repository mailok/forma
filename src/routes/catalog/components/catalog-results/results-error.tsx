import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Button } from "@/components/ui/button";

export function ResultsError(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () =>
    context.state.error ? (
      <div
        role="alert"
        class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
      >
        <p>{context.state.error}</p>
        <Button
          variant="link"
          size="compact"
          mix={on("click", () => context.retry())}
        >
          Try again
        </Button>
      </div>
    ) : null;
}

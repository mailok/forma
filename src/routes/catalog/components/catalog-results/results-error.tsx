import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Button } from "@/components/ui/button";

export function ResultsError(handle: Handle) {
  const { search } = handle.context.get(catalog.Context);
  search.updateOn(handle, ["errorchange"]);

  return () =>
    search.error ? (
      <div
        role="alert"
        class="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-clay/20 bg-clay-soft/70 px-5 py-4 text-sm text-ink"
      >
        <p>{search.error}</p>
        <Button
          variant="link"
          size="compact"
          mix={on("click", () => search.retry())}
        >
          Try again
        </Button>
      </div>
    ) : null;
}

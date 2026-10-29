import { on, type Handle } from "remix/component";
import * as catalog from "@/routes/catalog/components/catalog";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function ResultsPagination(handle: Handle) {
  const context = handle.context.get(catalog.Context);

  return () => {
    const { searchResults, status } = context.state;
    if (!searchResults.items.length) return null;

    return (
      <div class="flex flex-col items-center gap-4 pt-9 pb-3">
        <DiscoveryProgress
          shown={searchResults.items.length}
          total={searchResults.total}
        />
        {searchResults.hasMore ? (
          <LoadMoreButton
            loading={status === "loading-more"}
            disabled={status !== "idle"}
            onLoadMore={() => context.loadMore()}
          />
        ) : null}
      </div>
    );
  };
}

interface DiscoveryProgressProps {
  shown: number;
  total: number;
}

function DiscoveryProgress(handle: Handle<DiscoveryProgressProps>) {
  return () => {
    const { shown, total } = handle.props;

    return (
      <>
        <p class="text-[11px] text-stone-400">
          You have discovered{" "}
          <span class="font-medium text-stone-600">{shown}</span> of {total}{" "}
          {total === 1 ? "product" : "products"}
        </p>
        <ProgressBar value={Math.min(100, (shown / total) * 100)} />
      </>
    );
  };
}

interface ProgressBarProps {
  value: number;
}

function ProgressBar(handle: Handle<ProgressBarProps>) {
  return () => (
    <div class="h-0.5 w-36 overflow-hidden rounded-full bg-stone-200">
      <div
        class="h-full rounded-full bg-[#8da77f] transition-all"
        style={{ width: `${handle.props.value}%` }}
      />
    </div>
  );
}

interface LoadMoreButtonProps {
  loading: boolean;
  disabled: boolean;
  onLoadMore(): void;
}

function LoadMoreButton(handle: Handle<LoadMoreButtonProps>) {
  return () => (
    <Button
      disabled={handle.props.disabled}
      variant="outline"
      size="lg"
      class="mt-1"
      mix={on("click", () => handle.props.onLoadMore())}
    >
      {handle.props.loading ? (
        <>
          <Icon name="spinner" class="size-4 animate-spin" />
          Loading products…
        </>
      ) : (
        <>
          Discover more
          <Icon name="arrow" class="size-4" />
        </>
      )}
    </Button>
  );
}

interface PendingProductNavigation {
  path: string;
  signal: AbortSignal;
}

export function trackProductNavigation() {
  let pendingNavigation: PendingProductNavigation | undefined;

  document.addEventListener("astro:before-preparation", prepareNavigation);
  // Remix can replace the SSR cards while the destination is still loading.
  document.addEventListener("astro:hydrate", updatePendingCards, true);

  function prepareNavigation(event: DocumentEventMap["astro:before-preparation"]) {
    const card = event.sourceElement?.closest<HTMLElement>("[data-product-path]");
    const productPath = card?.dataset.productPath;
    if (!productPath || event.to.pathname !== productPath) return;

    const navigation: PendingProductNavigation = {
      path: productPath,
      signal: event.signal,
    };
    const originalLoader = event.loader;
    event.loader = loadProductPage;

    async function loadProductPage() {
      if (event.signal.aborted) return;
      pendingNavigation = navigation;
      updatePendingCards();
      event.signal.addEventListener("abort", finishNavigation, { once: true });

      try {
        await originalLoader();
      } finally {
        event.signal.removeEventListener("abort", finishNavigation);
        finishNavigation();
      }
    }

    function finishNavigation() {
      if (pendingNavigation?.signal !== event.signal) return;
      pendingNavigation = undefined;
      updatePendingCards();
    }
  }

  function updatePendingCards() {
    const cards = document.querySelectorAll<HTMLElement>("[data-product-path]");
    for (const card of cards) {
      card.toggleAttribute(
        "data-pending",
        card.dataset.productPath === pendingNavigation?.path,
      );
    }
  }
}

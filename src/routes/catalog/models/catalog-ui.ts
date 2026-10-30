import { Model } from "@/lib/model";
import type { ProductView } from "@/routes/catalog/types";

interface CatalogUiEvents {
  viewchange: void;
  mobilefilterschange: void;
}

export class CatalogUi extends Model<CatalogUiEvents> {
  #view: ProductView = "grid";
  #mobileFiltersOpen = false;

  get view(): ProductView {
    return this.#view;
  }

  get mobileFiltersOpen(): boolean {
    return this.#mobileFiltersOpen;
  }

  setView(view: ProductView): void {
    if (view === this.#view) {
      return;
    }
    this.#view = view;
    this.dispatch("viewchange");
  }

  toggleMobileFilters(): void {
    this.#mobileFiltersOpen = !this.#mobileFiltersOpen;
    this.dispatch("mobilefilterschange");
  }
}

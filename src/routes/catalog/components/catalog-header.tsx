import { NavLink, SiteHeader } from "@/components/site-header";

export function CatalogHeader() {
  return () => (
    <SiteHeader>
      <NavLink href="#catalog" history="replace" active class="hidden sm:block">
        Explore
      </NavLink>
      <NavLink href="#about-demo" history="replace">
        The idea behind it
      </NavLink>
    </SiteHeader>
  );
}

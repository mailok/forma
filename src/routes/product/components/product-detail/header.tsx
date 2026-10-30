import { NavLink, SiteHeader } from "@/components/site-header";

export function Header() {
  return () => (
    <SiteHeader>
      <NavLink href="/#catalog" active class="hidden sm:block">
        Explore
      </NavLink>
      <NavLink href="/#about-demo">The idea behind it</NavLink>
    </SiteHeader>
  );
}

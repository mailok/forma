import { Icon } from "@/components/icon";

export function SidebarNote() {
  return () => (
    <div class="mt-6 flex items-start gap-2.5 rounded-xl bg-[#f2f5ee] p-3.5 text-[#63745d]">
      <Icon name="leaf" class="mt-0.5 size-4 shrink-0" />
      <p class="text-[11px] leading-relaxed">
        Less, but better.
        <br />
        <span class="text-[#8a9585]">
          Every object has a reason to be here.
        </span>
      </p>
    </div>
  );
}

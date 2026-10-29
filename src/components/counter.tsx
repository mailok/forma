import { css, on, type Handle, type RemixNode } from "remix/component";

const counterStyles = css({
  padding: "1.5rem",
  border: "1px solid #d4dae5",
  borderRadius: "1rem",
  background: "white",
  "& h3": { marginTop: 0 },
  "& .counter-controls": {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  "& output": {
    minWidth: "3ch",
    textAlign: "center",
    fontSize: "2rem",
    fontVariantNumeric: "tabular-nums",
  },
  "& button": {
    minWidth: "2.75rem",
    minHeight: "2.75rem",
    padding: ".5rem .75rem",
    cursor: "pointer",
    font: "inherit",
    border: "1px solid #adb8ca",
    borderRadius: ".5rem",
    background: "#f6f7fb",
    color: "inherit",
  },
  "& button:hover": { background: "#e7ecf6" },
  "& button:focus-visible": {
    outline: "3px solid #3859d6",
    outlineOffset: "3px",
  },
  "& .counter-reset": { marginTop: "1rem" },
});

// css() accepts CSS properties, not Tailwind classes or @apply directives.
// Tailwind theme variables can still be reused here.
const tailwindTokenStyles = css({
  display: "inline-flex",
  marginBottom: "calc(var(--spacing) * 4)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--spacing) calc(var(--spacing) * 3)",
  backgroundColor: "var(--color-sky-100)",
  color: "var(--color-sky-800)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-semibold)",
});

interface Props {
  initialCount?: number;
  label?: string;
  children?: RemixNode;
}

export default function Counter(handle: Handle<Props>) {
  let count = handle.props.initialCount ?? 0;

  function changeCount(amount: number) {
    count += amount;
    void handle.update();
  }

  return () => (
    <section
      class="counter"
      mix={counterStyles}
      aria-label={handle.props.label ?? "Counter"}
    >
      <h3>{handle.props.label ?? "Counter"}</h3>
      <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
        Tailwind is working in Remix
      </p>
      <p mix={tailwindTokenStyles}>css() with Tailwind variables</p>
      <div class="counter-controls">
        <button
          class="bg-red-500"
          type="button"
          aria-label="Subtract one"
          mix={on("click", () => changeCount(-1))}
        >
          −
        </button>
        <output aria-live="polite" aria-atomic="true">
          {count}
        </output>
        <button
          type="button"
          aria-label="Add one"
          mix={on("click", () => changeCount(1))}
        >
          +
        </button>
      </div>
      <button
        class="counter-reset"
        type="button"
        mix={on("click", () => {
          count = handle.props.initialCount ?? 0;
          void handle.update();
        })}
      >
        Reset
      </button>
      {handle.props.children}
    </section>
  );
}

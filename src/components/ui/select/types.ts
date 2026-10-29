export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
}

export type SelectVariant = "default" | "subtle";

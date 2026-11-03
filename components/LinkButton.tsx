import type { ReactNode } from "react";

type Props = {
  href: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  variant?: "primary" | "outline" | "quiet";
  external?: boolean;
};

export const buttonBase =
  "group flex min-h-[3.5rem] w-full items-center gap-3 rounded-2xl px-5 text-left transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0";

export const buttonVariants = {
  primary:
    "bg-gradient-to-b from-bronze to-bronze-deep text-ivory shadow-[0_8px_20px_-10px_rgba(125,69,32,0.7)] hover:shadow-[0_12px_24px_-10px_rgba(125,69,32,0.8)]",
  outline: "border border-bronze/60 bg-ivory/60 text-espresso hover:border-bronze hover:bg-ivory",
  quiet: "border border-line bg-ivory/40 text-espresso hover:border-bronze/60 hover:bg-ivory/80",
};

export function LinkButton({ href, label, hint, icon, variant = "outline", external = false }: Props) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} className={`${buttonBase} ${buttonVariants[variant]}`} {...ext}>
      <span className="grid size-6 shrink-0 place-items-center [&>svg]:size-[1.35rem]">{icon}</span>
      <span className="flex-1 text-[1.02rem] font-medium leading-tight">{label}</span>
      {hint ? <span className="text-sm opacity-75">{hint}</span> : null}
    </a>
  );
}

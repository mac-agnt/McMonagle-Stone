import Image from "next/image";
import { Stack } from "@phosphor-icons/react/dist/ssr";

export type AppKey = "gmail" | "whatsapp" | "calendar" | "aib" | "mcmonagle";

/** `mcmonagle` is the system itself, drawn from the sidebar mark, not a file. */
const sources: Record<Exclude<AppKey, "mcmonagle">, string> = {
  gmail: "/logos/gmail.png",
  whatsapp: "/logos/whatsapp.png",
  calendar: "/logos/calendar.png",
  aib: "/logos/aib.png",
};

// Gmail and WhatsApp source images are transparent marks with no baked-in
// badge, so they render bare (no card bg/shadow) instead of boxed.
const hasBadgeBg: Record<Exclude<AppKey, "mcmonagle">, boolean> = {
  gmail: false,
  whatsapp: false,
  calendar: true,
  aib: true,
};

export function AppLogo({
  app,
  size = 36,
  className,
}: {
  app: AppKey;
  size?: number;
  className?: string;
}) {
  if (app === "mcmonagle") {
    return (
      <span
        style={{ width: size, height: size }}
        className={`flex shrink-0 items-center justify-center rounded-[11px] bg-accent text-accent-ink ${
          className ?? ""
        }`}
      >
        <Stack size={size * 0.5} weight="fill" />
      </span>
    );
  }

  const badged = hasBadgeBg[app];

  return (
    <span
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[11px] ${
        badged ? "bg-white shadow-[0_1px_3px_rgba(15,23,42,0.15)]" : ""
      } ${className ?? ""}`}
    >
      <Image
        src={sources[app]}
        alt=""
        width={size}
        height={size}
        className={badged ? "size-full object-cover" : "size-full object-contain"}
        unoptimized
      />
    </span>
  );
}

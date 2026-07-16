import type { Icon } from "@phosphor-icons/react";
import {
  Sparkle,
  SquaresFour,
  Package,
  FunnelSimple,
  Warning,
  Boat,
  FileText,
  Users,
  Gear,
} from "@phosphor-icons/react/dist/ssr";

export type NavItem = {
  label: string;
  href: string;
  icon: Icon;
  slug: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: Sparkle, slug: "home" },
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour, slug: "dashboard" },
  { label: "Orders", href: "/orders", icon: Package, slug: "orders" },
  { label: "Pipeline", href: "/pipeline", icon: FunnelSimple, slug: "pipeline" },
  { label: "Delays", href: "/delays", icon: Warning, slug: "delays" },
  { label: "Arrivals", href: "/arrivals", icon: Boat, slug: "arrivals" },
  { label: "Reports", href: "/reports", icon: FileText, slug: "reports" },
  { label: "Team", href: "/team", icon: Users, slug: "team" },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Gear, slug: "settings" },
];

export const allNav = [...primaryNav, ...secondaryNav];

import {
  Hammer,
  SprayCan,
  Shield,
  ShieldCheck,
  Wrench,
  LifeBuoy,
  Truck,
  Car,
  Gift,
  Euro,
  Clock,
  type LucideIcon,
} from "lucide-react";

/** Icônes des services */
export const serviceIcons: Record<string, LucideIcon> = {
  hammer: Hammer,
  spray: SprayCan,
  "shield-glass": ShieldCheck,
  wrench: Wrench,
  tire: LifeBuoy,
  truck: Truck,
};

/** Icônes des avantages */
export const advantageIcons: Record<string, LucideIcon> = {
  shield: Shield,
  car: Car,
  gift: Gift,
  euro: Euro,
  clock: Clock,
};

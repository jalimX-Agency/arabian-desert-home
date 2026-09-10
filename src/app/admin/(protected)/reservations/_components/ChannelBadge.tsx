import { Globe, Mail, MessageCircle, Building2 } from "lucide-react";
import { channelLabel, channelBadgeColor } from "../_lib/reservation-utils";

const channelIcon: Record<string, React.ElementType> = {
  website: Globe,
  email: Mail,
  whatsapp: MessageCircle,
  "booking.com": Building2,
  expedia: Building2,
  "trip.com": Building2,
};

export function ChannelBadge({ channel }: { channel: string }) {
  const Icon = channelIcon[channel] ?? Globe;
  return (
    <span
      title={`Réservation reçue via ${channelLabel[channel] ?? channel}`}
      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${channelBadgeColor[channel] ?? channelBadgeColor.website}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {channelLabel[channel] ?? channel}
    </span>
  );
}

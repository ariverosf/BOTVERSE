import { EarIcon, FileIcon, HeadphonesIcon, ImageIcon, LocateIcon, TypeIcon, VideoIcon } from "lucide-react";

type CaptureInfoProps = {
  type: string;
};

export default function Message({ type }: CaptureInfoProps) {
  const text = {
    "text": {
      label: "Enviar Texto",
      icon: TypeIcon
    },
    "audio": {
      label: "Enviar Audio",
      icon: HeadphonesIcon
    },
    "image": {
      label: "Enviar Imagen",
      icon: ImageIcon
    },
    "video": {
      label: "Enviar Video",
      icon: VideoIcon
    },
    "file": {
      label: "Enviar Archivo",
      icon: FileIcon
    },
    "location": {
      label: "Enviar Ubicación",
      icon: LocateIcon
    },
    "action": {
      label: "Acción",
      icon: LocateIcon
    }
  };

  const Icon = text[type as keyof typeof text].icon;

  return (
    <div className="flex gap-2 text-xs bg-gray-50 border-gray-200 border rounded px-2 py-1 text-gray-700 items-center">
      <Icon className="text-green-600" size={14} />
      { text[type as keyof typeof text].label }
    </div>
  );
}
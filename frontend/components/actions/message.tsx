import { Handle, Position } from "@xyflow/react";
import { FileIcon, HeadphonesIcon, ImageIcon, LocateIcon, TypeIcon, VideoIcon } from "lucide-react";
import { useRef } from "react";

type MessageProps = {
  type: string;
  id: string;
  top?: number;
};

export default function Message({ type, id, top }: MessageProps) {
  const ref = useRef<HTMLParagraphElement>(null);
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
  const handleId = `handle-${id}`;

  return (
    <div className="relative flex gap-2 text-xs bg-gray-50 border-gray-200 border rounded px-2 py-1 text-gray-700 items-center">
      <Icon className="text-green-600" size={14} />
      <span ref={ref}>{ text[type as keyof typeof text].label }</span>
      <Handle
        key={handleId}
        type="source"
        position={Position.Right}
        id={handleId}
      />
    </div>
  );
}
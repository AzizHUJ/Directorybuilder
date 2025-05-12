import { Folder } from "lucide-react";

interface FolderIconProps {
  color: string;
  className?: string;
}

export default function FolderIcon({ color, className = "" }: FolderIconProps) {
  // Map the color string to the actual color
  let colorClass;

  switch (color) {
    case "project":
      colorClass = "text-red-500";
      break;
    case "username":
      colorClass = "text-teal-600";
      break;
    case "work":
      colorClass = "text-blue-600";
      break;
    case "scene":
      colorClass = "text-purple-500";
      break;
    case "shot":
      colorClass = "text-red-500";
      break;
    case "data":
      colorClass = "text-teal-600";
      break;
    case "software":
      colorClass = "text-teal-600";
      break;
    case "source":
      colorClass = "text-red-500";
      break;
    case "output":
      colorClass = "text-red-500";
      break;
    default:
      colorClass = "text-slate-500";
  }

  return <Folder className={`h-5 w-5 mr-1 ${colorClass} ${className}`} />;
}

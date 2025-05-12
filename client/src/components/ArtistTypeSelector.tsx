import { Card, CardContent } from "@/components/ui/card";
import {
  Folder,
  Film,
  Box,
  Sparkles,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ArtistTypeSelectorProps {
  form: UseFormReturn<any>;
}

export default function ArtistTypeSelector({ form }: ArtistTypeSelectorProps) {
  const artistType = form.watch("artistType");

  const handleArtistTypeClick = (type: string) => {
    form.setValue("artistType", type);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <h2 className="text-lg font-medium mb-3">Select Artist Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleArtistTypeClick("editor")}
            className={`flex flex-col items-center justify-center p-3 border rounded hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-50 focus:border-slate-500 ${
              artistType === "editor"
                ? "bg-slate-100 border-slate-400"
                : "border-slate-200"
            }`}
          >
            <Folder className="h-6 w-6 mb-1 text-slate-700" />
            <span className="text-sm font-medium">Editor</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleArtistTypeClick("motion")}
            className={`flex flex-col items-center justify-center p-3 border rounded hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-50 focus:border-slate-500 ${
              artistType === "motion"
                ? "bg-slate-100 border-slate-400"
                : "border-slate-200"
            }`}
          >
            <Film className="h-6 w-6 mb-1 text-slate-700" />
            <span className="text-sm font-medium">Motion</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleArtistTypeClick("cg")}
            className={`flex flex-col items-center justify-center p-3 border rounded hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-50 focus:border-slate-500 ${
              artistType === "cg"
                ? "bg-slate-100 border-slate-400"
                : "border-slate-200"
            }`}
          >
            <Box className="h-6 w-6 mb-1 text-slate-700" />
            <span className="text-sm font-medium">CG Artist</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleArtistTypeClick("vfx")}
            className={`flex flex-col items-center justify-center p-3 border rounded hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-50 focus:border-slate-500 ${
              artistType === "vfx"
                ? "bg-slate-100 border-slate-400"
                : "border-slate-200"
            }`}
          >
            <Sparkles className="h-6 w-6 mb-1 text-slate-700" />
            <span className="text-sm font-medium">VFX Artist</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

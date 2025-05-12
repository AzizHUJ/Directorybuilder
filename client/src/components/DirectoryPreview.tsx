import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import FolderIcon from "@/components/FolderIcon";
import { generateEditorStructure, generateMotionStructure, generateCGStructure, generateVFXStructure } from "@/lib/directoryTemplates";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface DirectoryPreviewProps {
  artistType: string;
  username: string;
  projectName: string;
  scenes: {
    name: string;
    shots: { name: string }[];
  }[];
  directoryGenerated: boolean;
}

export default function DirectoryPreview({
  artistType,
  username,
  projectName,
  scenes,
  directoryGenerated,
}: DirectoryPreviewProps) {
  const [dirStructure, setDirStructure] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Generate directory structure based on artist type
    let structure;
    switch (artistType) {
      case "editor":
        structure = generateEditorStructure();
        break;
      case "motion":
        structure = generateMotionStructure(scenes);
        break;
      case "cg":
        structure = generateCGStructure(scenes);
        break;
      case "vfx":
        structure = generateVFXStructure(scenes);
        break;
      default:
        structure = null;
    }
    
    setDirStructure(structure);
  }, [artistType, scenes]);

  return (
    <>
      <ScrollArea className="border border-slate-200 rounded bg-slate-50 h-[500px] p-2 tree-view overflow-visible">
        <div className="flex items-center mb-2">
          <FolderIcon color="project" />
          <span className="text-sm font-medium">
            {projectName ? `/${projectName}` : "/project_name"}
          </span>
        </div>
        
        <ul className="list-none pl-5">
          <li>
            <ul className="list-none pl-0">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="username" />
                  <span className="text-sm">
                    {username ? `/${username}` : "/username"}
                  </span>
                </div>
                
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/work</span>
                    </div>
                    
                    <ul className="list-none pl-5" id="artist-specific-structure">
                      {dirStructure || (
                        <li className="text-sm text-slate-500 py-2">
                          Select an artist type and fill in the required information to preview the directory structure
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </ScrollArea>
      
      {directoryGenerated && (
        <div className="mt-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Directory structure generated successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}

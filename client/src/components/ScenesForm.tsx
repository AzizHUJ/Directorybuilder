import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { sanitizeInput } from "@/lib/directoryUtils";
import { UseFormReturn } from "react-hook-form";
import { Plus, Minus, RefreshCw } from "lucide-react";

interface ScenesFormProps {
  form: UseFormReturn<any>;
  artistType: string;
}

export default function ScenesForm({ form, artistType }: ScenesFormProps) {
  const scenes = form.watch("scenes") || [];
  const [sceneCount, setSceneCount] = useState(scenes.length || 1);
  const [useAutoNaming, setUseAutoNaming] = useState(false);

  // Auto-generate scene and shot names
  const generateAutoNames = () => {
    const currentScenes = [...scenes];
    
    currentScenes.forEach((scene, sceneIndex) => {
      // Set scene name
      const sceneNum = (sceneIndex + 1).toString().padStart(2, '0');
      scene.name = `scene_${sceneNum}`;
      
      // Set shot names
      if (scene.shots) {
        scene.shots.forEach((shot: {name: string}, shotIndex: number) => {
          const scenePrefix = (sceneIndex + 1).toString();
          const shotNum = (shotIndex + 1).toString().padStart(3, '0');
          shot.name = `shot_${scenePrefix}${shotNum}`;
        });
      }
    });
    
    form.setValue("scenes", currentScenes);
  };
  
  // Use auto-naming when the state changes
  useEffect(() => {
    if (useAutoNaming) {
      generateAutoNames();
    }
  }, [useAutoNaming, sceneCount]);

  // Update scenes when scene count changes
  useEffect(() => {
    const currentScenes = form.getValues("scenes") || [];
    const newScenes = [...currentScenes];

    // Add scenes if needed
    if (sceneCount > currentScenes.length) {
      for (let i = currentScenes.length; i < sceneCount; i++) {
        newScenes.push({
          name: useAutoNaming ? `scene_${(i + 1).toString().padStart(2, '0')}` : "",
          shots: [{ 
            name: useAutoNaming ? `shot_${(i + 1).toString()}001` : "" 
          }],
        });
      }
    }
    // Remove scenes if needed
    else if (sceneCount < currentScenes.length) {
      newScenes.splice(sceneCount);
    }

    form.setValue("scenes", newScenes);
  }, [sceneCount, form, useAutoNaming]);

  const handleSceneNameChange = (index: number, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    const newScenes = [...scenes];
    newScenes[index] = {
      ...newScenes[index],
      name: sanitizedValue,
    };
    form.setValue("scenes", newScenes);
  };

  const handleShotCountChange = (sceneIndex: number, shotCount: number) => {
    const currentScenes = [...scenes];
    const currentShots = currentScenes[sceneIndex].shots || [];
    const newShots = [...currentShots];

    // Add shots if needed
    if (shotCount > currentShots.length) {
      for (let i = currentShots.length; i < shotCount; i++) {
        if (useAutoNaming) {
          const scenePrefix = (sceneIndex + 1).toString();
          const shotNum = (i + 1).toString().padStart(3, '0');
          newShots.push({ name: `shot_${scenePrefix}${shotNum}` });
        } else {
          newShots.push({ name: "" });
        }
      }
    }
    // Remove shots if needed
    else if (shotCount < currentShots.length) {
      newShots.splice(shotCount);
    }

    currentScenes[sceneIndex] = {
      ...currentScenes[sceneIndex],
      shots: newShots,
    };

    form.setValue("scenes", currentScenes);
  };

  const handleShotNameChange = (
    sceneIndex: number,
    shotIndex: number,
    value: string
  ) => {
    const sanitizedValue = sanitizeInput(value);
    const newScenes = [...scenes];
    if (!newScenes[sceneIndex].shots) {
      newScenes[sceneIndex].shots = [];
    }
    newScenes[sceneIndex].shots[shotIndex] = {
      ...newScenes[sceneIndex].shots[shotIndex],
      name: sanitizedValue,
    };
    form.setValue("scenes", newScenes);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <h2 className="text-lg font-medium mb-3">Scene Information</h2>
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="use-auto-naming" 
              checked={useAutoNaming}
              onCheckedChange={(checked) => setUseAutoNaming(checked as boolean)}
            />
            <Label 
              htmlFor="use-auto-naming" 
              className="text-sm font-medium cursor-pointer"
            >
              Use automatic naming
            </Label>
          </div>
          
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={generateAutoNames}
            className="flex items-center space-x-1"
            disabled={!scenes.length}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Apply Auto-Naming
          </Button>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="scene-count">Number of Scenes</Label>
          <div className="flex items-center mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSceneCount(Math.max(1, sceneCount - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="px-3 text-center min-w-[40px]">{sceneCount}</div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSceneCount(sceneCount + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {scenes.map((scene: {name: string, shots: {name: string}[]}, sceneIndex: number) => (
            <div
              key={sceneIndex}
              className="scene-input pb-3 mb-4 border-b border-slate-200 rounded-md"
            >
              <div className="flex items-center justify-between mb-2 bg-slate-100 p-2 rounded-t-md border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700">
                  Scene {sceneIndex + 1}
                </h3>
              </div>

              <div className="mb-3 p-2">
                <Label htmlFor={`scene-name-${sceneIndex}`} className="text-slate-800 font-medium">Scene Name</Label>
                <div className="relative mt-1">
                  <Input
                    id={`scene-name-${sceneIndex}`}
                    value={scene.name}
                    onChange={(e) =>
                      handleSceneNameChange(sceneIndex, e.target.value)
                    }
                    placeholder="Enter scene name"
                    className="pr-20 border-slate-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                    {scene.name}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">Only lowercase letters allowed. Spaces will be replaced with underscores.</p>
              </div>

              {(artistType === "cg" || artistType === "vfx") && (
                <div className="shot-controls pl-3 border-l-2 border-slate-200">
                  <div className="mb-3">
                    <Label htmlFor={`shot-count-${sceneIndex}`}>
                      Number of Shots
                    </Label>
                    <div className="flex items-center mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleShotCountChange(
                            sceneIndex,
                            Math.max(1, (scene.shots?.length || 1) - 1)
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="px-3 text-center min-w-[40px]">
                        {scene.shots?.length || 1}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleShotCountChange(
                            sceneIndex,
                            (scene.shots?.length || 0) + 1
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="shot-inputs space-y-3">
                    {scene.shots?.map((shot: {name: string}, shotIndex: number) => (
                      <div
                        key={shotIndex}
                        className="shot-input pl-3 border-l-2 border-slate-200"
                      >
                        <Label
                          htmlFor={`shot-name-${sceneIndex}-${shotIndex}`}
                        >
                          Shot {shotIndex + 1} Name
                        </Label>
                        <div className="relative">
                          <Input
                            id={`shot-name-${sceneIndex}-${shotIndex}`}
                            value={shot.name}
                            onChange={(e) =>
                              handleShotNameChange(
                                sceneIndex,
                                shotIndex,
                                e.target.value
                              )
                            }
                            placeholder="Enter shot name"
                            className="pr-20"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                            {shot.name}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Only lowercase letters allowed. Spaces will be replaced with underscores.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

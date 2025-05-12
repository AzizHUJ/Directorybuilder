import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { sanitizeInput } from "@/lib/directoryUtils";
import { UseFormReturn } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, CheckCircle } from "lucide-react";

interface ProjectInfoFormProps {
  form: UseFormReturn<any>;
}

export default function ProjectInfoForm({ form }: ProjectInfoFormProps) {
  const { formState: { errors } } = form;
  const [hasProjectCode, setHasProjectCode] = useState(false);
  const [projectCode, setProjectCode] = useState("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    form.setValue(name, sanitizedValue);
  };
  
  const handleProjectCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow alphanumeric values for project codes
    const code = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setProjectCode(code);
  };
  
  const lookupProjectCode = async () => {
    if (!projectCode) return;
    
    try {
      setIsLoadingCode(true);
      const response = await fetch(`/api/project-code/${projectCode}`);
      
      if (response.ok) {
        const data = await response.json();
        // Apply template data to form
        form.setValue("artistType", data.artistType);
        form.setValue("projectName", data.projectName);
        form.setValue("scenes", data.scenes || []);
        
        toast({
          title: "Project loaded",
          description: `Successfully loaded project: ${data.projectName}`,
        });
      } else {
        // Handle error response
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Project code not found",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to lookup project code:", error);
      toast({
        title: "Error",
        description: "Failed to lookup project code",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCode(false);
    }
  };
  
  // When project code is enabled/disabled
  useEffect(() => {
    if (!hasProjectCode) {
      setProjectCode("");
    }
  }, [hasProjectCode]);
  
  // Generate a project code for the current configuration
  const generateCode = async () => {
    const values = form.getValues();
    
    // Check if required fields are filled
    if (!values.artistType || !values.projectName) {
      toast({
        title: "Missing information",
        description: "Please select an artist type and enter a project name",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGeneratingCode(true);
      const response = await fetch('/api/project-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artistType: values.artistType,
          projectName: values.projectName,
          username: values.username || "shared",
          scenes: values.scenes || []
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.projectCode);
        toast({
          title: "Project code generated",
          description: "Your project code has been created. Save it to share with others."
        });
      }
    } catch (error) {
      console.error("Failed to generate project code:", error);
      toast({
        title: "Error",
        description: "Failed to generate project code",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };
  
  // Copy the code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied to clipboard",
      description: "Project code has been copied to clipboard"
    });
  };
  
  // When project code changes
  useEffect(() => {
    if (hasProjectCode && projectCode && projectCode.length >= 6) {
      lookupProjectCode();
    }
  }, [projectCode]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <h2 className="text-lg font-medium mb-3">Project Information</h2>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="has-project-code" 
            checked={hasProjectCode}
            onCheckedChange={(checked) => setHasProjectCode(checked as boolean)}
          />
          <Label htmlFor="has-project-code" className="font-medium">
            I have a project code
          </Label>
        </div>
        
        {hasProjectCode ? (
          <div className="mb-4 space-y-2">
            <Label htmlFor="projectCode">Project Code</Label>
            <div className="relative">
              <Input
                id="projectCode"
                placeholder="Enter project code"
                value={projectCode}
                onChange={handleProjectCodeChange}
                className="pr-10"
              />
              {isLoadingCode && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full" />
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Enter a project code to autofill project settings
            </p>
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label>Share This Configuration</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateCode}
                disabled={isGeneratingCode}
                className="flex items-center space-x-1"
              >
                {isGeneratingCode ? (
                  <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full mr-1" />
                ) : null}
                <span>Generate Code</span>
              </Button>
            </div>
            
            {generatedCode && (
              <div className="mt-2 bg-slate-100 p-3 rounded border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Project Code:</p>
                  <p className="text-lg font-mono font-bold">{generatedCode}</p>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center"
                >
                  <ClipboardCopy className="h-4 w-4 mr-1" />
                  <span>Copy</span>
                </Button>
              </div>
            )}
            
            <p className="text-xs text-slate-500">
              Generate a code to share this project structure with your team
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter username"
                value={form.watch("username") || ""}
                onChange={(e) => handleInputChange("username", e)}
                className={errors.username ? "border-red-500" : ""}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                {form.watch("username")}
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">Only lowercase letters allowed. Spaces will be replaced with underscores.</p>
            {errors.username && (
              <p className="text-sm font-medium text-red-500">
                {errors.username.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <div className="relative">
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={form.watch("projectName") || ""}
                onChange={(e) => handleInputChange("projectName", e)}
                className={errors.projectName ? "border-red-500" : ""}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                {form.watch("projectName")}
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">Only lowercase letters allowed. Spaces will be replaced with underscores.</p>
            {errors.projectName && (
              <p className="text-sm font-medium text-red-500">
                {errors.projectName.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

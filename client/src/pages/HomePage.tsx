import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ArtistTypeSelector from "@/components/ArtistTypeSelector";
import ProjectInfoForm from "@/components/ProjectInfoForm";
import ScenesForm from "@/components/ScenesForm";
import DirectoryPreview from "@/components/DirectoryPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import { Form } from "@/components/ui/form";
import malaLogo from "../assets/mala-logo.webp";

// Define the form schema
const formSchema = z.object({
  artistType: z.enum(["editor", "motion", "cg", "vfx"]),
  username: z.string().min(1, "Username is required"),
  projectName: z.string().min(1, "Project name is required"),
  scenes: z.array(
    z.object({
      name: z.string(),
      shots: z.array(
        z.object({
          name: z.string()
        })
      )
    })
  ).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function HomePage() {
  const { toast } = useToast();
  const [directoryGenerated, setDirectoryGenerated] = useState(false);
  
  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistType: "editor",
      username: "",
      projectName: "",
      scenes: [{ name: "", shots: [{ name: "" }] }]
    }
  });
  
  // Watch form values for preview updates
  const artistType = form.watch("artistType");
  const username = form.watch("username");
  const projectName = form.watch("projectName");
  const scenes = form.watch("scenes");
  
  // Create mutation for generating directory structure
  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/directory", data);
      return response.json();
    },
    onSuccess: () => {
      setDirectoryGenerated(true);
      toast({
        title: "Success!",
        description: "Directory structure generated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate directory structure: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch('/api/directory/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to download directory structure');
      }
      
      // Get the file as blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and click it to download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.projectName}_structure.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Download started",
        description: "Your directory structure is being downloaded",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Download failed",
        description: "Failed to download directory structure: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Submit handler
  const onSubmit = (data: FormValues) => {
    generateMutation.mutate(data);
  };
  
  // Download handler
  const handleDownload = () => {
    const data = form.getValues();
    downloadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={malaLogo} alt="Mala Studio" className="h-8" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[hsl(18,100%,50%)] rounded flex items-center justify-center">
                <Folder className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">DirectoryBuilder</h1>
            </div>
          </div>
          <div>
            <Button 
              variant="default" 
              onClick={handleDownload}
              disabled={!directoryGenerated || downloadMutation.isPending}
              className="bg-[hsl(18,100%,50%)] hover:bg-[hsl(18,100%,45%)]"
            >
              Download ZIP
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 md:flex md:space-x-6 bg-black">
        {/* Form Section */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ArtistTypeSelector form={form} />
            
            <ProjectInfoForm form={form} />
            
            {/* Show scenes form only for certain artist types */}
            {(artistType === "motion" || artistType === "cg" || artistType === "vfx") && (
              <ScenesForm form={form} artistType={artistType} />
            )}
            
            {/* Generate Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-full bg-[hsl(18,100%,50%)] hover:bg-[hsl(18,100%,45%)]" 
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? "Generating..." : "Generate Directory Structure"}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Preview Section */}
        <div className="md:w-1/2">
          <Card className="p-4 h-full">
            <h2 className="text-lg font-medium mb-3">Directory Structure Preview</h2>
            
            <DirectoryPreview 
              artistType={artistType} 
              username={username} 
              projectName={projectName} 
              scenes={scenes || []}
              directoryGenerated={directoryGenerated}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}

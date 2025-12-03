import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { directorySchema } from "@shared/schema";
import { getProjectTemplateByCode, generateProjectCode, addProjectTemplate } from "./projectCodes";
import * as fs from 'fs';
import * as path from 'path';
import archiver, { type Archiver } from 'archiver';
import { promisify } from 'util';
import { createReadStream, createWriteStream } from 'fs';
import os from 'os';
import { randomUUID } from 'crypto';

export async function registerRoutes(app: Express): Promise<Server> {
  // Create new directory structure
  app.post('/api/directory', async (req: Request, res: Response) => {
    try {
      const validation = directorySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid directory data", 
          errors: validation.error.errors 
        });
      }
      
      const directoryData = validation.data;
      const directory = await storage.createDirectoryStructure({
        projectName: directoryData.projectName,
        username: directoryData.username,
        artistType: directoryData.artistType,
        scenes: directoryData.scenes || []
      });
      
      res.status(201).json(directory);
    } catch (error) {
      res.status(500).json({ message: "Failed to create directory structure" });
    }
  });

  // Lookup project by code
  app.get('/api/project-code/:code', (req: Request, res: Response) => {
    const { code } = req.params;
    
    if (!code) {
      return res.status(400).json({ message: "Project code is required" });
    }
    
    const template = getProjectTemplateByCode(code);
    
    if (!template) {
      return res.status(404).json({ message: "Project code not found" });
    }
    
    res.json({
      projectName: template.projectName,
      artistType: template.artistType,
      scenes: template.scenes || []
    });
  });
  
  // Generate a new project code for a directory structure
  app.post('/api/project-code', async (req: Request, res: Response) => {
    try {
      const validation = directorySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid directory data", 
          errors: validation.error.errors 
        });
      }
      
      const directoryData = validation.data;
      const projectCode = generateProjectCode();
      
      // Save the template with the generated code
      addProjectTemplate(projectCode, {
        id: projectCode,
        projectName: directoryData.projectName,
        artistType: directoryData.artistType,
        scenes: directoryData.scenes || []
      });
      
      res.status(201).json({
        projectCode,
        message: "Project code created successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create project code" });
    }
  });

  // Generate and download a ZIP file with the directory structure
  app.post('/api/directory/download', async (req: Request, res: Response) => {
    try {
      const validation = directorySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid directory data", 
          errors: validation.error.errors 
        });
      }
      
      const directoryData = validation.data;
      
      // Generate a temp file path for the zip
      const tempDir = os.tmpdir();
      const zipFilePath = path.join(tempDir, `directory-${randomUUID()}.zip`);
      
      // Create a write stream to the temp file
      const output = createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });
      
      // Listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', function() {
        // Send the zip file to the client
        res.download(zipFilePath, `${directoryData.projectName}_structure.zip`, (err) => {
          // Delete the temp file after sending
          fs.unlink(zipFilePath, () => {});
        });
      });
      
      // Handle errors
      archive.on('error', function(err: Error) {
        res.status(500).json({ message: "Failed to create zip file" });
      });
      
      // Pipe archive data to the file
      archive.pipe(output);
      
      // Create base structure
      createDirectoryStructureInZip(archive, directoryData);
      
      // Finalize the archive (i.e. we are done appending files)
      archive.finalize();
    } catch (error) {
      res.status(500).json({ message: "Failed to generate directory structure" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to create directory structure in zip
function createDirectoryStructureInZip(archive: Archiver, directoryData: any) {
  const { projectName, username, artistType, scenes } = directoryData;
  
  // Add project metadata file
  const metadataContent = 
`Project: ${projectName}
Username: ${username}
Artist Type: ${artistType}
Created: ${new Date().toLocaleString()}`;
  
  archive.append(metadataContent, { name: `${projectName}/${username}/project_metadata.txt` });
  
  // Add standard README
  const readmeContent = 
`# Project Structure
This directory structure was generated by DirectoryBuilder.
Follow the standard structure for ${artistType} artists.`;
  
  archive.append(readmeContent, { name: `${projectName}/README.md` });
  
  // Create base folders
  archive.append('', { name: `${projectName}/${username}/work/` });
  
  // Create structure based on artist type
  switch (artistType) {
    case 'editor':
      createEditorStructure(archive, projectName, username);
      break;
    case 'motion':
      createMotionStructure(archive, projectName, username, scenes);
      break;
    case 'cg':
      createCGStructure(archive, projectName, username, scenes);
      break;
    case 'vfx':
      createVFXStructure(archive, projectName, username, scenes);
      break;
  }
}

function createEditorStructure(archive: Archiver, projectName: string, username: string) {
  const basePath = `${projectName}/${username}/work`;
  
  // Timeline structure
  archive.append('', { name: `${basePath}/timeline/` });
  archive.append('', { name: `${basePath}/timeline/software/` });
  archive.append('', { name: `${basePath}/timeline/source/` });
  
  // Footage structure
  archive.append('', { name: `${basePath}/timeline/source/footage/` });
  archive.append('', { name: `${basePath}/timeline/source/footage/videos/` });
  archive.append('', { name: `${basePath}/timeline/source/footage/images/` });
  archive.append('', { name: `${basePath}/timeline/source/footage/vfx_imports/` });
  archive.append('', { name: `${basePath}/timeline/source/footage/cgi_imports/` });
  archive.append('', { name: `${basePath}/timeline/source/footage/motion_imports/` });
  
  // Audio structure
  archive.append('', { name: `${basePath}/timeline/source/audio/` });
  archive.append('', { name: `${basePath}/timeline/source/audio/mix/` });
  archive.append('', { name: `${basePath}/timeline/source/audio/music/` });
  archive.append('', { name: `${basePath}/timeline/source/audio/sfx/` });
  archive.append('', { name: `${basePath}/timeline/source/audio/vo/` });
  
  // References and output
  archive.append('', { name: `${basePath}/timeline/references/` });
  archive.append('', { name: `${basePath}/output/` });
  archive.append('', { name: `${basePath}/output/wip/` });
  archive.append('', { name: `${basePath}/output/publish/` });
  
  // Add README files
  archive.append('Contains final edited sequences for review', 
    { name: `${basePath}/output/wip/README.txt` });
  archive.append('Contains final delivery files for the project', 
    { name: `${basePath}/output/publish/README.txt` });
}

function createMotionStructure(archive: Archiver, projectName: string, username: string, scenes: any) {
  const basePath = `${projectName}/${username}/work`;
  
  // If no scenes provided, create default
  if (!scenes || scenes.length === 0) {
    const scenePath = `${basePath}/scene_name`;
    archive.append('', { name: `${scenePath}/` });
    archive.append('', { name: `${scenePath}/software/` });
    archive.append('', { name: `${scenePath}/source/` });
    archive.append('', { name: `${scenePath}/source/footage/` });
    archive.append('', { name: `${scenePath}/source/graphics/` });
    archive.append('', { name: `${scenePath}/source/audio/` });
    archive.append('', { name: `${scenePath}/references/` });
    archive.append('', { name: `${scenePath}/output/` });
    archive.append('', { name: `${scenePath}/output/wip/` });
    archive.append('', { name: `${scenePath}/output/publish/` });
  } else {
    // Create structure for each scene
    scenes.forEach((scene: any) => {
      if (scene.name) {
        const scenePath = `${basePath}/${scene.name}`;
        archive.append('', { name: `${scenePath}/` });
        archive.append('', { name: `${scenePath}/software/` });
        archive.append('', { name: `${scenePath}/source/` });
        archive.append('', { name: `${scenePath}/source/footage/` });
        archive.append('', { name: `${scenePath}/source/graphics/` });
        archive.append('', { name: `${scenePath}/source/audio/` });
        archive.append('', { name: `${scenePath}/references/` });
        archive.append('', { name: `${scenePath}/output/` });
        archive.append('', { name: `${scenePath}/output/wip/` });
        archive.append('', { name: `${scenePath}/output/publish/` });
      }
    });
  }
}

function createCGStructure(archive: Archiver, projectName: string, username: string, scenes: any) {
  const basePath = `${projectName}/${username}/work`;
  
  // If no scenes provided, create default
  if (!scenes || scenes.length === 0) {
    const scenePath = `${basePath}/scene_name`;
    const shotPath = `${scenePath}/shot_name`;
    
    archive.append('', { name: `${scenePath}/` });
    archive.append('', { name: `${shotPath}/` });
    archive.append('', { name: `${shotPath}/software/` });
    archive.append('', { name: `${shotPath}/software/source/` });
    archive.append('', { name: `${shotPath}/software/source/models/` });
    archive.append('', { name: `${shotPath}/software/source/animations/` });
    archive.append('', { name: `${shotPath}/software/source/other/` });
    archive.append('', { name: `${shotPath}/software/output/` });
    archive.append('', { name: `${shotPath}/software/output/wip/` });
    archive.append('', { name: `${shotPath}/software/output/publish/` });
    archive.append('', { name: `${shotPath}/references/` });
  } else {
    // Create structure for each scene and shot
    scenes.forEach((scene: any) => {
      if (scene.name) {
        const scenePath = `${basePath}/${scene.name}`;
        archive.append('', { name: `${scenePath}/` });
        
        // If no shots, create default
        if (!scene.shots || scene.shots.length === 0) {
          const shotPath = `${scenePath}/shot_name`;
          archive.append('', { name: `${shotPath}/` });
          archive.append('', { name: `${shotPath}/software/` });
          archive.append('', { name: `${shotPath}/software/source/` });
          archive.append('', { name: `${shotPath}/software/source/models/` });
          archive.append('', { name: `${shotPath}/software/source/animations/` });
          archive.append('', { name: `${shotPath}/software/source/other/` });
          archive.append('', { name: `${shotPath}/software/output/` });
          archive.append('', { name: `${shotPath}/software/output/wip/` });
          archive.append('', { name: `${shotPath}/software/output/publish/` });
          archive.append('', { name: `${shotPath}/references/` });
        } else {
          // Create structure for each shot
          scene.shots.forEach((shot: any) => {
            if (shot.name) {
              const shotPath = `${scenePath}/${shot.name}`;
              archive.append('', { name: `${shotPath}/` });
              archive.append('', { name: `${shotPath}/software/` });
              archive.append('', { name: `${shotPath}/software/source/` });
              archive.append('', { name: `${shotPath}/software/source/models/` });
              archive.append('', { name: `${shotPath}/software/source/animations/` });
              archive.append('', { name: `${shotPath}/software/source/other/` });
              archive.append('', { name: `${shotPath}/software/output/` });
              archive.append('', { name: `${shotPath}/software/output/wip/` });
              archive.append('', { name: `${shotPath}/software/output/publish/` });
              archive.append('', { name: `${shotPath}/references/` });
            }
          });
        }
      }
    });
  }
}

function createVFXStructure(archive: Archiver, projectName: string, username: string, scenes: any) {
  const basePath = `${projectName}/${username}/work`;
  
  // If no scenes provided, create default
  if (!scenes || scenes.length === 0) {
    const scenePath = `${basePath}/scene_name`;
    const shotPath = `${scenePath}/shot_name`;
    
    archive.append('', { name: `${scenePath}/` });
    archive.append('', { name: `${shotPath}/` });
    archive.append('', { name: `${shotPath}/data/` });
    archive.append('', { name: `${shotPath}/data/raw/` });
    archive.append('', { name: `${shotPath}/data/onset/` });
    archive.append('', { name: `${shotPath}/software/` });
    archive.append('', { name: `${shotPath}/software/source/` });
    archive.append('', { name: `${shotPath}/software/source/ext/` });
    archive.append('', { name: `${shotPath}/software/source/cleanup/` });
    archive.append('', { name: `${shotPath}/software/source/other/` });
    archive.append('', { name: `${shotPath}/output/` });
    archive.append('', { name: `${shotPath}/output/wip/` });
    archive.append('', { name: `${shotPath}/output/publish/` });
  } else {
    // Create structure for each scene and shot
    scenes.forEach((scene: any) => {
      if (scene.name) {
        const scenePath = `${basePath}/${scene.name}`;
        archive.append('', { name: `${scenePath}/` });
        
        // If no shots, create default
        if (!scene.shots || scene.shots.length === 0) {
          const shotPath = `${scenePath}/shot_name`;
          archive.append('', { name: `${shotPath}/` });
          archive.append('', { name: `${shotPath}/data/` });
          archive.append('', { name: `${shotPath}/data/raw/` });
          archive.append('', { name: `${shotPath}/data/onset/` });
          archive.append('', { name: `${shotPath}/software/` });
          archive.append('', { name: `${shotPath}/software/source/` });
          archive.append('', { name: `${shotPath}/software/source/ext/` });
          archive.append('', { name: `${shotPath}/software/source/cleanup/` });
          archive.append('', { name: `${shotPath}/software/source/other/` });
          archive.append('', { name: `${shotPath}/output/` });
          archive.append('', { name: `${shotPath}/output/wip/` });
          archive.append('', { name: `${shotPath}/output/publish/` });
        } else {
          // Create structure for each shot
          scene.shots.forEach((shot: any) => {
            if (shot.name) {
              const shotPath = `${scenePath}/${shot.name}`;
              archive.append('', { name: `${shotPath}/` });
              archive.append('', { name: `${shotPath}/data/` });
              archive.append('', { name: `${shotPath}/data/raw/` });
              archive.append('', { name: `${shotPath}/data/onset/` });
              archive.append('', { name: `${shotPath}/software/` });
              archive.append('', { name: `${shotPath}/software/source/` });
              archive.append('', { name: `${shotPath}/software/source/ext/` });
              archive.append('', { name: `${shotPath}/software/source/cleanup/` });
              archive.append('', { name: `${shotPath}/software/source/other/` });
              archive.append('', { name: `${shotPath}/output/` });
              archive.append('', { name: `${shotPath}/output/wip/` });
              archive.append('', { name: `${shotPath}/output/publish/` });
            }
          });
        }
      }
    });
  }
}

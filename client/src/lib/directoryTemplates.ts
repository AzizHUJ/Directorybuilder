/**
 * This file re-exports the React components from directoryTemplates.tsx
 * to maintain compatibility with any code that might import from the .ts file
 */

export {
  generateEditorStructure,
  generateMotionStructure,
  generateCGStructure,
  generateVFXStructure
} from './directoryTemplates.tsx';

/**
 * Type definitions for directory structure components
 */
export interface Shot {
  name: string;
}

export interface Scene {
  name: string;
  shots: Shot[];
}

export interface DirectoryData {
  projectName: string;
  username: string;
  artistType: 'editor' | 'motion' | 'cg' | 'vfx';
  scenes?: Scene[];
}

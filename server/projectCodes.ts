/**
 * Project code storage and lookup functionality
 */

interface ProjectTemplate {
  id: string;
  projectName: string;
  artistType: string;
  scenes?: {
    name: string;
    shots: { name: string }[];
  }[];
  createdAt?: string;
}

// In-memory storage for project templates
class ProjectTemplateStorage {
  private templates: Map<string, ProjectTemplate>;
  
  constructor() {
    this.templates = new Map();
    
    // Add sample templates
    this.addSampleTemplates();
  }
  
  private addSampleTemplates() {
    const sampleTemplates = [
      {
        id: "ABC123",
        projectName: "brand_campaign",
        artistType: "editor",
        scenes: []
      },
      {
        id: "DEF456",
        projectName: "promo_video",
        artistType: "motion",
        scenes: [
          {
            name: "intro",
            shots: [
              { name: "shot_01" },
              { name: "shot_02" }
            ]
          },
          {
            name: "middle",
            shots: [
              { name: "shot_01" },
              { name: "shot_02" },
              { name: "shot_03" }
            ]
          },
          {
            name: "outro",
            shots: [
              { name: "shot_01" }
            ]
          }
        ]
      },
      {
        id: "GHI789",
        projectName: "product_showcase",
        artistType: "cg",
        scenes: [
          {
            name: "scene_01",
            shots: [
              { name: "product_rotate" },
              { name: "product_zoom" }
            ]
          },
          {
            name: "scene_02",
            shots: [
              { name: "product_explode" },
              { name: "product_assemble" }
            ]
          }
        ]
      },
      {
        id: "JKL012",
        projectName: "commercial",
        artistType: "vfx",
        scenes: [
          {
            name: "establishing",
            shots: [
              { name: "wide_shot" },
              { name: "buildings" }
            ]
          },
          {
            name: "product_reveal",
            shots: [
              { name: "particle_effect" },
              { name: "glow_effect" },
              { name: "reflection" }
            ]
          }
        ]
      }
    ];
    
    // Add all sample templates to the map
    sampleTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }
  
  /**
   * Get a template by its code
   */
  getByCode(code: string): ProjectTemplate | undefined {
    return this.templates.get(code.toUpperCase());
  }
  
  /**
   * Add a new template with the given code
   */
  addTemplate(code: string, template: ProjectTemplate): void {
    this.templates.set(code, {
      ...template,
      id: code,
      createdAt: new Date().toISOString()
    });
  }
  
  /**
   * Check if a template with the given code exists
   */
  exists(code: string): boolean {
    return this.templates.has(code.toUpperCase());
  }
  
  /**
   * Get all templates
   */
  getAllTemplates(): ProjectTemplate[] {
    return Array.from(this.templates.values());
  }
}

// Create a singleton instance
const templateStorage = new ProjectTemplateStorage();

/**
 * Looks up a project template by code
 * 
 * @param code - The project code to look up
 * @returns The project template or undefined if not found
 */
export function getProjectTemplateByCode(code: string): ProjectTemplate | undefined {
  return templateStorage.getByCode(code);
}

/**
 * Add a new project template with the given code
 * 
 * @param code - The project code
 * @param template - The project template data
 */
export function addProjectTemplate(code: string, template: ProjectTemplate): void {
  templateStorage.addTemplate(code, template);
}

/**
 * Check if a project code exists
 * 
 * @param code - The project code to check
 * @returns True if the code exists, false otherwise
 */
export function projectCodeExists(code: string): boolean {
  return templateStorage.exists(code);
}

/**
 * Generates a random project code
 * 
 * @returns A random 6-character alphanumeric code
 */
export function generateProjectCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate a unique code
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (projectCodeExists(result));
  
  return result;
}
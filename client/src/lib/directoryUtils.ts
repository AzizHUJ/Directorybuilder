/**
 * Sanitizes the input to be used as a directory name
 * 
 * @param input - The user input string
 * @returns A sanitized string with spaces replaced by underscores and invalid characters removed
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Convert to lowercase
  let sanitized = input.toLowerCase();
  
  // Replace spaces with underscores
  sanitized = sanitized.replace(/\s+/g, '_');
  
  // Remove invalid characters (keeping only alphanumeric, underscore, and hyphen)
  sanitized = sanitized.replace(/[^a-z0-9_-]/g, '');
  
  return sanitized;
}

/**
 * Generates a folder path string with the correct formatting
 * 
 * @param name - The name of the folder
 * @returns A properly formatted folder path string
 */
export function formatFolderPath(name: string): string {
  return `/${name}`;
}

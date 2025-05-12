/**
 * zipGenerator.ts
 * 
 * This file contains utility functions related to ZIP generation.
 * Note: The actual ZIP generation is handled by the server.
 */

import { apiRequest } from "@/lib/queryClient";

/**
 * Downloads a directory structure as a ZIP file
 * 
 * @param data - The directory structure data
 * @returns A Promise that resolves when the download is complete
 */
export async function downloadDirectoryAsZip(data: any): Promise<void> {
  try {
    const response = await fetch('/api/directory/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
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
  } catch (error) {
    console.error('Error downloading ZIP file:', error);
    throw error;
  }
}

/**
 * Helper utility to convert various Google Drive & document URLs into clean embeddable preview URLs
 */
export function formatGoogleDriveEmbedUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  // Extract ID from drive.google.com/file/d/FILE_ID/view...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
  }

  // Extract ID from drive.google.com/open?id=FILE_ID or docs.google.com/uc?id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
  }

  // Already preview
  if (trimmed.includes('drive.google.com') && trimmed.includes('/preview')) {
    return trimmed;
  }

  // Google Docs / Sheets / Slides preview
  if (trimmed.includes('docs.google.com') && (trimmed.includes('/edit') || trimmed.includes('/view'))) {
    return trimmed.replace(/\/edit.*$/, '/preview').replace(/\/view.*$/, '/preview');
  }

  // Fallback if direct PDF link or external document link
  if (trimmed.startsWith('http')) {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

export function formatExternalUrl(url: string): string {
  if (!url) return '#';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

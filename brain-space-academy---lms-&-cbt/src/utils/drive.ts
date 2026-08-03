/**
 * Helper utility to convert various Google Drive & document URLs into clean embeddable preview URLs
 */

/**
 * Extract Google Drive file ID from various link formats
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Raw File ID string (e.g. 1Bzx7tT3i82xR1y9O0-G6kQ1h7U63N_f2)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  // Pattern: /file/d/FILE_ID or /file/u/0/d/FILE_ID or /document/d/FILE_ID or /presentation/d/FILE_ID
  const matchD = trimmed.match(/\/(?:file|document|presentation|spreadsheets)\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/i);
  if (matchD && matchD[1]) {
    return matchD[1];
  }

  // Pattern: ?id=FILE_ID or &id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1]) {
    return matchId[1];
  }

  return null;
}

/**
 * Helper utility to convert various Google Drive & document URLs into clean embeddable preview URLs
 */
export function formatGoogleDriveEmbedUrl(url: string, useDocsViewerFallback = false): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Extract Google Drive File ID if present
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    if (useDocsViewerFallback) {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(`https://drive.google.com/uc?id=${fileId}&export=download`)}`;
    }
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Google Docs / Sheets / Slides preview
  if (trimmed.includes('docs.google.com')) {
    if (trimmed.includes('/presentation/d/')) {
      const match = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return `https://docs.google.com/presentation/d/${match[1]}/embed`;
    }
    if (trimmed.includes('/spreadsheets/d/')) {
      const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return `https://docs.google.com/spreadsheets/d/${match[1]}/pubhtml?widget=true&headers=false`;
    }
    if (trimmed.includes('/document/d/')) {
      const match = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return `https://docs.google.com/document/d/${match[1]}/preview`;
    }
  }

  // If already preview or embed link
  if (trimmed.endsWith('/preview') || trimmed.endsWith('/embed')) {
    return trimmed;
  }

  // External non-Google Drive direct PDF link
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (useDocsViewerFallback || !trimmed.toLowerCase().endsWith('.pdf')) {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(trimmed)}`;
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Get direct Google Drive URL for opening in a new browser tab
 */
export function getGoogleDriveDirectViewUrl(url: string): string {
  if (!url) return '#';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  return formatExternalUrl(url);
}

export function formatExternalUrl(url: string): string {
  if (!url) return '#';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

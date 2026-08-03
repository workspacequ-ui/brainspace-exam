// Utility for interacting with Neon PostgreSQL backend API

export interface NeonStatus {
  connected: boolean;
  urlSet: boolean;
  message: string;
  dbName?: string;
  serverTime?: string;
  version?: string;
}

export async function checkNeonStatus(): Promise<NeonStatus> {
  try {
    const res = await fetch('/api/neon/status');
    const data = await res.json().catch(() => null);
    if (data && typeof data.connected === 'boolean') {
      return data;
    }
    return {
      connected: false,
      urlSet: false,
      message: res.statusText ? `HTTP ${res.status}: ${res.statusText}` : 'Respon server tidak valid'
    };
  } catch (e: any) {
    return {
      connected: false,
      urlSet: false,
      message: 'Gagal terhubung ke backend server: ' + (e?.message || 'Server offline')
    };
  }
}

export async function bulkSyncToNeon(payload: Record<string, any>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/neon/bulk-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sync failed');
    }
    return await res.json();
  } catch (e: any) {
    return {
      success: false,
      message: e?.message || 'Gagal sinkronisasi ke database Neon'
    };
  }
}

export async function bulkLoadFromNeon(): Promise<Record<string, any> | null> {
  try {
    const res = await fetch('/api/neon/bulk-load');
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (e) {
    console.error('Failed to load from Neon', e);
    return null;
  }
}

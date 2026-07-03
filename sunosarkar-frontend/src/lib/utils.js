// Safe error message extractor â€” handles plain string, object, array responses
export function extractError(err, fallback = 'Something went wrong') {
  if (!err) return fallback;

  const data = err?.response?.data;

  // Plain string response (our new GlobalExceptionHandler returns plain strings)
  if (typeof data === 'string' && data.trim()) return data.trim();

  // Object with message/error/detail fields
  if (data && typeof data === 'object') {
    if (data.message) return data.message;
    if (data.error)   return data.error;
    if (data.detail)  return data.detail;
    // Spring validation error format
    const vals = Object.values(data).filter(v => typeof v === 'string');
    if (vals.length) return vals[0];
  }

  // Network / timeout error
  if (err?.message) return err.message;

  return fallback;
}

// Safe array — handles all Spring page response shapes â€” handles all common API response shapes
export function safeArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content))    return data.content;
  if (data && Array.isArray(data.data))       return data.data;
  if (data && Array.isArray(data.complaints)) return data.complaints;
  if (data && Array.isArray(data.items))      return data.items;
  if (data && Array.isArray(data.result))     return data.result;
  if (data && typeof data === 'object') {
    const key = Object.keys(data).find(k => Array.isArray(data[k]));
    if (key) return data[key];
  }
  return [];
}

// Format date
export function fmtDate(dateStr) {
  if (!dateStr) return 'â€”';
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return 'â€”'; }
}

export function fmtDateShort(dateStr) {
  if (!dateStr) return 'â€”';
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short',
    });
  } catch { return 'â€”'; }
}

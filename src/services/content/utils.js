export const contentApiBaseUrl = import.meta.env.VITE_CONTENT_API_BASE_URL;

export function mergeRecord(contentRecord, configRecord) {
  return {
    ...contentRecord,
    ...(configRecord ?? {}),
  };
}

export function mergeArrayById(contentItems = [], configItemsById = {}) {
  return contentItems.map((item) => mergeRecord(item, configItemsById[item.id]));
}

export async function fetchJsonFromApi(path) {
  if (!contentApiBaseUrl) return null;

  const response = await fetch(`${contentApiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Content API request failed: ${response.status}`);
  }

  return response.json();
}

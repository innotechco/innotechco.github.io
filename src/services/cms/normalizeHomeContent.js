function pickObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function pickArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeHomeContent(response) {
  const source = pickObject(response?.home ?? response);

  return {
    ...source,
    hero: pickObject(source.hero),
    ecosystemCards: pickArray(source.ecosystemCards),
    latestNews: pickObject(source.latestNews),
    liveInsights: {
      ...pickObject(source.liveInsights),
      cards: pickArray(source.liveInsights?.cards),
    },
    globalFootprint: pickObject(source.globalFootprint),
  };
}

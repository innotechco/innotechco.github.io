export const sortOptions = [
  {label: "Most popular", value: "popular"},
  {label: "Newest", value: "newest"},
  {label: "Oldest", value: "oldest"},
  {label: "Longest read", value: "longest"},
];

export const archiveItems = Array.from({length: 40}, (_, index) => {
  const month = (index % 12) + 1;
  const day = (index % 27) + 1;
  const year = 2026 - (index % 4);
  const readMinutes = 2 + (index % 9);

  return {
    id: index + 1,
    title:
      "InnotechCo launches INCEPTION - an AI-powered innovation management system",
    description:
      "A compact look at innovation workflows, AI agents, market intelligence, and digital transformation for industrial teams.",
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    popularity: 1000 - index * 17,
    readMinutes,
  };
});

export const getTaskLists = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taskLists`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasklists");
  }
  const data = await response.json();
  return data;
};

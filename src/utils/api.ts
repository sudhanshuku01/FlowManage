export const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
};

export const postData = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to post data");
  return await response.json();
};

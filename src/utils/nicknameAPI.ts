const ENDPOINT = "https://api.fungenerators.com/name/generate?category=alien&limit=25";

export const requestRandomNicknames = async () => {
  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();

    if (data.success) return data?.contents?.names;
    else throw new Error("No authorisation to access API");

  } catch (error: any) {
    console.error(error?.message ?? "Unknown network error");
    return [];
  };
};

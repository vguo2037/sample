const ENDPOINT = "https://api.fungenerators.com/name/generate?category=alien&limit=25";

const shuffleArray = (array: Array<any>) => {
  array.sort(() => 0.5 - Math.random());
};

export const requestRandomNicknames = async () => {
  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();

    if (data.success) {
      const randomNicknames = data?.contents?.names;
      
      // as the external API will repeat outputted names on multiple calls, this avoids repeated sequences
      shuffleArray(randomNicknames);

      return randomNicknames;
    }
    else throw new Error("No authorisation to access API");

  } catch (error: any) {
    console.error(error?.message ?? "Unknown network error");
    return [];
  };
};

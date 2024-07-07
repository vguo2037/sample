const ENDPOINT = "https://api.fungenerators.com/name/generate?category=alien&limit=25";

const shuffleArray = (array: Array<unknown>) => {
  array.sort(() => 0.5 - Math.random());
};

export const requestRandomNicknames = async () => {
  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();

    if (data?.contents?.names) {
      const randomNicknames = data?.contents?.names;
      
      // as the external API will repeat outputted names on multiple calls,
      // this hopefully avoids repeated sequences
      shuffleArray(randomNicknames);

      return randomNicknames;
    }
    else throw new Error(data.error?.message);

  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    alert(error?.message ?? "Unknown network error");
    console.error(error);
    return [];
  }
};

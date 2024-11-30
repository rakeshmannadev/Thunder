import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const fetchSong = async (query, url) => {
  const options = {
    method: "GET",
    url: process.env.SAAVN_API + url,
    params: { query: query },
  };

  try {
    const { data } = await axios.request(options);
    const result = data.data.results;
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const fetchAlbum = async (id, url) => {
  const options = {
    method: "GET",
    url: process.env.SAAVN_URL + url,
    params: { id },
  };

  try {
    const data = await axios.request(options);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

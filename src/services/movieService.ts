import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const SEARCH_MOVIE_ENDPOINT = "/search/movie";

interface FetchMoviesParams {
  query: string;
  page?: number;
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const tmdbToken = import.meta.env.VITE_TMDB_TOKEN as string;

if (!tmdbToken) {
  console.error("VITE_TMDB_TOKEN is not set in environment variables");
}

export async function fetchMovies({
  query,
  page = 1,
}: FetchMoviesParams): Promise<Movie[]> {
  const url = `${BASE_URL}${SEARCH_MOVIE_ENDPOINT}`;

  const config = {
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${tmdbToken}`,
    },
  };

  const response = await axios.get<MoviesResponse>(url, config);

  return response.data.results;
}

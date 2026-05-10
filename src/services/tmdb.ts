import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const instance = axios.create({
  baseURL: BASE_URL,
});

export const requests = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=fr-FR`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213&language=fr-FR`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=fr-FR`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28&language=fr-FR`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35&language=fr-FR`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27&language=fr-FR`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749&language=fr-FR`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99&language=fr-FR`,
  searchMovies: (query: string) => `/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`,
  fetchMovieDetails: (id: string | number) => `/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,recommendations`,
  fetchTvDetails: (id: string | number) => `/tv/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,recommendations`,
  fetchSeasonDetails: (tvId: string | number, seasonNumber: number) => `/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=fr-FR`,
  fetchFrembedLatest: "https://frembed.one/api/public/v1/movies?limit=20&order=latest",
  fetchMovieProviders: (id: string | number) => `/movie/${id}/watch/providers?api_key=${API_KEY}`,
  fetchTvProviders: (id: string | number) => `/tv/${id}/watch/providers?api_key=${API_KEY}`,
};

export default instance;

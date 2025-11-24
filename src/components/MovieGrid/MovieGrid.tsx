import type React from "react";
import styles from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const getPosterUrl = (posterPath: string): string => {
  if (!posterPath) {
    return "";
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <button
            type="button"
            className={styles.card}
            onClick={() => onSelect(movie)}
          >
            {movie.poster_path && (
              <img
                className={styles.image}
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                loading="lazy"
              />
            )}
            <h2 className={styles.title}>{movie.title}</h2>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;

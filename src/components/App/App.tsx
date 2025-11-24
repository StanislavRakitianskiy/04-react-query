import type React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

interface MoviesQueryResponse {
  movies: Movie[];
  totalPages: number;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching, status } =
    useQuery<MoviesQueryResponse>({
      queryKey: ["movies", query, page],
      queryFn: () => fetchMovies({ query, page }),
      enabled: query.trim().length > 0,
      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    if (
      status === "success" &&
      data &&
      query.trim().length > 0 &&
      data.movies.length === 0
    ) {
      toast.error("No movies found for your request.");
    }
  }, [status, data, query]);

  useEffect(() => {
    if (isError) {
      toast.error("There was an error, please try again...");
    }
  }, [isError]);

  const movies: Movie[] = data?.movies ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  const handleSearch = (searchQuery: string): void => {
    setQuery(searchQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = (): void => {
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLoader = isLoading || isFetching;

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <main className={styles.main}>
        {showLoader && <Loader />}

        {!showLoader && isError && <ErrorMessage />}

        {!showLoader && !isError && movies.length > 0 && (
          <>
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          </>
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </main>
      <Toaster position="top-right" />
    </>
  );
};

export default App;

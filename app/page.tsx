/* eslint-disable */

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuth } from "./lib/firebase/auth";
import Grid from "./components/grid";
import WelcomePopup from "./components/WelcomePopup";

interface Actor {
  id: string;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  actors: Actor[];
}

interface MovieResponse {
  results: {
    id: number;
    title: string;
    vote_count: number;
    vote_average: number;
  }[];
}

interface CreditsResponse {
  cast: {
    id: number;
    name: string;
    known_for_department: string;
  }[];
}

const App = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuth((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMoviesAndActors = async () => {
      try {
        const moviesResponse = await fetch("/api/tmdb?endpoint=popular");
        const moviesData: MovieResponse = await moviesResponse.json();

        console.log(
          "All movies:",
          moviesData.results.map((movie) => ({
            title: movie.title,
            id: movie.id,
            vote_count: movie.vote_count,
            vote_average: movie.vote_average,
          }))
        );

        let selectedMovies: Movie[] = [];
        let attempts = 0;
        const maxAttempts = 50;

        while (selectedMovies.length < 4 && attempts < maxAttempts) {
          attempts++;

          const tempSelected = moviesData.results
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

          // check for actor overlaps
          const movieDetails = await Promise.all(
            tempSelected.map(async (movie) => {
              const creditsResponse = await fetch(
                `/api/tmdb?endpoint=credits&movieId=${movie.id}`
              );
              const creditsData: CreditsResponse = await creditsResponse.json();

              return {
                id: movie.id,
                title: movie.title,
                actors: creditsData.cast
                  .filter((actor) => actor.known_for_department === "Acting")
                  .slice(0, 4)
                  .map((actor) => ({
                    id: actor.id.toString(),
                    name: actor.name,
                  })),
              };
            })
          );

          const usedActorIds = new Set();
          let hasOverlap = false;

          for (const movie of movieDetails) {
            for (const actor of movie.actors) {
              if (usedActorIds.has(actor.id)) {
                hasOverlap = true;
                break;
              }
              usedActorIds.add(actor.id);
            }
            if (hasOverlap) break;
          }

          if (
            !hasOverlap &&
            movieDetails.every((movie) => movie.actors.length === 4)
          ) {
            selectedMovies = movieDetails;
            break;
          }
        }

        setMovies(selectedMovies);

        // combine and shuffle all actors for the grid
        const allActors = selectedMovies
          .flatMap((movie) => movie.actors)
          .sort(() => Math.random() - 0.5);

        setActors(allActors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMoviesAndActors();
  }, []);

  if (loading) {
    return (
      <div className="app-container bg-background min-h-screen h-full w-full">
        <h1 className="text-center text-3xl font-bold text-white mb-4 pt-4">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="app-container bg-background min-h-screen h-full w-full">
      <h1 className="text-center text-3xl font-bold text-white mb-4 pt-4">
        StarLinks
      </h1>
      <h2 className="text-center text-xl font-bold text-white mb-4">
        Create four groups of four!
      </h2>
      <Grid actors={actors} gridSize={4} movies={movies} />
      <WelcomePopup />
    </div>
  );
};

export default App;

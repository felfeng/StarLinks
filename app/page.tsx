"use client";
import React, { useEffect, useState } from "react";
import Grid from "./components/grid";

interface Actor {
  id: string;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  actors: Actor[];
}

const App = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesAndActors = async () => {
      try {
        const moviesResponse = await fetch('/api/tmdb?endpoint=popular');
        const moviesData = await moviesResponse.json();
        
        const selectedMovies = moviesData.results
          .slice(0, 50) // out of top 50 popular movies
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);  // get 4 random movies

        // fetch cast for each movie
        const moviesWithCast = await Promise.all(
          selectedMovies.map(async (movie: any) => {
            const creditsResponse = await fetch(`/api/tmdb?endpoint=credits&movieId=${movie.id}`);
            const creditsData = await creditsResponse.json();
            
            // get top 4 billed actors
            const topCast = creditsData.cast
              .filter((actor: any) => actor.known_for_department === "Acting")
              .slice(0, 4)
              .map((actor: any) => ({
                id: actor.id.toString(),
                name: actor.name,
              }));

            return {
              id: movie.id,
              title: movie.title,
              actors: topCast
            };
          })
        );

        setMovies(moviesWithCast);
        
        // combine and shuffle all actors for the grid
        const allActors = moviesWithCast.flatMap(movie => movie.actors)
          .sort(() => Math.random() - 0.5);
        
        setActors(allActors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    </div>
  );
};

export default App;
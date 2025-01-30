type TMDBCastMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};

const EXCLUDED_MOVIE_IDS = [
  354912, 10681, 77338, 129, 637, 13, 278, 8587, 324786, 280, 185, 14, 489, 62,
  372058, 600, 508442, 539, 641, 4935, 497, 207,
];

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const movieId = searchParams.get("movieId");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (endpoint === "popular") {
      const pages = await Promise.all(
        [1, 2, 3, 4, 5, 6, 7, 8].map((page) =>
          axios.get(`${process.env.TMDB_API_URL}/discover/movie`, {
            params: {
              api_key: process.env.TMDB_API_KEY,
              sort_by: "vote_count.desc",
              "vote_count.gte": 10000,
              "vote_average.gte": 8.0,
              page: page,
            },
          })
        )
      );

      const allMovies = pages
        .flatMap((response) => response.data.results)
        .filter((movie) => !EXCLUDED_MOVIE_IDS.includes(movie.id));

      const selectedMovies = [];
      const usedActorIds = new Set();

      for (const movie of allMovies) {
        if (selectedMovies.length === 50) break;

        const credits = await axios.get(
          `${process.env.TMDB_API_URL}/movie/${movie.id}/credits`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
            },
          }
        );

        const topActors = credits.data.cast
          .filter(
            (actor: TMDBCastMember) => actor.known_for_department === "Acting"
          )
          .slice(0, 4);

        const hasOverlap = topActors.some((actor: TMDBCastMember) =>
          usedActorIds.has(actor.id)
        );

        if (!hasOverlap && topActors.length === 4) {
          selectedMovies.push(movie);
          topActors.forEach((actor: TMDBCastMember) =>
            usedActorIds.add(actor.id)
          );
        }
      }

      return NextResponse.json({ results: selectedMovies });
    }

    if (endpoint === "credits" && movieId) {
      const response = await axios.get(
        `${process.env.TMDB_API_URL}/movie/${movieId}/credits`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
          },
        }
      );
      return NextResponse.json(response.data);
    }

    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data from TMDB" },
      { status: 500 }
    );
  }
}

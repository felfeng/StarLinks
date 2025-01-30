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
  372058, 600, 508442, 539, 641, 4935, 497, 207, 103, 490132, 77, 101, 510, 73,
  244786, 293660, 150540, 14160, 297762, 102899, 12, 259316, 694, 585, 862,
  9806,
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
              "vote_count.gte": 8000,
              "vote_average.gte": 7.0,
              page: page,
              per_page: 40,
            },
            timeout: 5000,
          })
        )
      );

      const allMovies = pages
        .flatMap((response) => response.data.results)
        .filter((movie) => !EXCLUDED_MOVIE_IDS.includes(movie.id));

      return NextResponse.json({ results: allMovies });
    }

    if (endpoint === "credits" && movieId) {
      const response = await axios.get(
        `${process.env.TMDB_API_URL}/movie/${movieId}/credits`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
          },
          timeout: 5000,
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

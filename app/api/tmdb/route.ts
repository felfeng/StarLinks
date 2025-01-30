/* eslint-disable */

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
  9806, 102651, 87827, 162, 10191, 324552, 57158, 425, 62177, 1271, 607, 1895,
  78, 863, 137113, 393, 10528, 447332, 122917, 285, 752, 10193, 348, 20352, 558,
  118, 127585, 330459, 49047, 177572, 333339, 1892, 6479, 429617, 58, 269149,
  109445, 424694, 205596, 1891, 198663, 2062, 808, 381288, 101299, 49051,
  383498, 37165, 100402, 12444, 263115, 245891, 140607, 767, 675, 286217,
  634649, 12445, 22, 284053, 674, 272, 283995,
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
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) =>
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

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const movieId = searchParams.get('movieId');

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint parameter is required' },
      { status: 400 }
    );
  }

  try {
    if (endpoint === 'popular') {
      const response = await axios.get(
        `${process.env.TMDB_API_URL}/discover/movie`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            sort_by: 'vote_count.desc',
            'vote_count.gte': 10000,
            'vote_average.gte': 7.0,
            page: 1,
          },
        }
      );
      return NextResponse.json(response.data);
    }
    
    if (endpoint === 'credits' && movieId) {
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

    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data from TMDB' },
      { status: 500 }
    );
  }
}

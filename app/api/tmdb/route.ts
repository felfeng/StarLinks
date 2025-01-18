import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `${process.env.TMDB_API_URL}/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data from TMDB' },
      { status: 500 }
    );
  }
}

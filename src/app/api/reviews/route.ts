import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('http://o-complex.com:1337/reviews');
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: 'Ошибка при запросе к API' },
      { status: 500 }
    );
  }
}

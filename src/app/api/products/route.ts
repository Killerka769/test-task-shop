import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const page_size = url.searchParams.get('page_size') || '20';

    const response = await axios.get(`http://o-complex.com:1337/products?page=${page}&page_size=${page_size}`);

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ message: 'Ошибка при запросе к API продуктов' }, { status: 500 });
  }
}

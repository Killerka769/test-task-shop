import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('http://o-complex.com:1337/order', body);
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ message: 'Ошибка при отправке заказа' }, { status: 500 });
  }
}

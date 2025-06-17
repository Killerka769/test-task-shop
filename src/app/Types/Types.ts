export type TReviews = {
    id: number,
    text: string
}

export type TProducts = {
  items: TProductItem[];
  total: number;
  page: number;
  page_size: number;
};

export type TProductItem = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
};

export type TBasketItem = TProductItem & { count: number };
  
export type TCart = {
  id: number,
  quantity: number
}

export type TPostProduct = {
  phone: string,
  cart: TCart[],
}
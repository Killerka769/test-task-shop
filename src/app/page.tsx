'use client'
import { useEffect, useRef, useState } from 'react';
import useGetProducts from './Hooks/useGetProducts';
import useGetReviews from './Hooks/useGetReviews';
import './styles/styles.scss';
import { TBasketItem, TProductItem, TReviews } from './Types/Types';
import useBasketStore from './Store/Store';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import usePostProducts from './Hooks/usePostProducts';
import DOMPurify from 'dompurify';
import Loader from './components/Loader';


export default function Home() {
  const { dataReviews, loadingReviews, errorReviews } = useGetReviews() as {
    dataReviews?: TReviews[];
    loadingReviews: boolean;
    errorReviews: boolean;
  };

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const {
    dataProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadingProducts,
    errorProducts,
  } = useGetProducts();

  const { mutatePostProduct, isPendingPostProduct, isErrorPostProduct, isSuccessPostProduct } = usePostProducts();

  const basket = useBasketStore(e=>e.basket);
  const addItem = useBasketStore(e=>e.addItem);
  const incrementItem = useBasketStore(e=>e.incrementItem);
  const decrementItem = useBasketStore(e=>e.decrementItem);

  const loaderRef = useRef(null);

  const totalSum = basket.reduce((sum, item) => sum + item.price * item.count, 0);

  useEffect(() => {
    const currentRef = loaderRef.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


  useEffect(() => {
    if (isSuccessPostProduct) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // скрыть через 3 секунды
    }
  }, [isSuccessPostProduct]);


  if (loadingReviews || loadingProducts) return <Loader />;
  if (errorReviews) return <h1>Ошибка загрузки отзывов</h1>;
  if (errorProducts) return <h1>Ошибка загрузки продуктов</h1>;

  function add( e : TBasketItem | (TProductItem & { count?: number }) ){
    const el : TBasketItem = {
      id: e.id,
      title: e.title,
      count: e.count || 1,
      price: e.price,
      description: e.description,
      image_url: e.image_url,
    }
    addItem(el);
  }

  return (
    <div className='mainDiv'>
      <div className='testText'>
        <h1>тестовое задание</h1>
      </div>

      <h1>Отзывы:</h1>
      <div className='containerReviews'>
        {dataReviews?.map((review: TReviews) => (
            <div
              className='reviews'
              key={review.id}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(review.text) }}
            />
        ))}
      </div>

      <div className='mainForm'>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
          <h1>Добавленные товары</h1>

          {basket.map(el => (
            <div key={el.id}>
              {el.title} x{el.count} — {el.price * el.count} ₽
            </div>
          ))}
          {totalSum > 0 && (<h3>Итого: {totalSum}</h3>)}
          <label>Телефон:</label>
            <PhoneInput
              country={'ru'}
              value={phone}
              onChange={setPhone}
              inputStyle={{ width: '300px', height: '50px', fontSize: '26px' }}
            />
          <button type="submit" disabled={basket.length === 0} onClick={()=>{
              if (!phone.trim()) {
                setPhoneError('Пожалуйста, введите номер телефона');
                return;
              }
            mutatePostProduct({
            phone: phone.trim(),
            cart: basket.map(item => ({
                id: item.id,
                quantity: item.count, // переименование count → quantity
              })),
          })}}>
            {isPendingPostProduct ? ('Отправка...') : ('Отправить заказ')} 
          </button>
          {phoneError && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{phoneError}</div>}
          {showPopup && (
            <div className='containerSuccess'>
              <div className='success'>
                Спасибо за заказ! 💌
              </div>
            </div>
          )}
          {isErrorPostProduct && (<h1>Что-то пошло не так..</h1>)}
        </form>
      </div>


      <div className='containerProducts'>
        <div className='cards'>
          {dataProducts?.pages.map((page) =>
            page.items.map((el: TProductItem) => { 
              const inBasket = basket.find(item => item.id === el.id);
              return(<div className='product' key={el.id}>
                <img src={el.image_url} alt={el.title} width={300} />
                <h2>{el.title}</h2>
                <p>{el.description}</p>
                <p>Цена: {el.price} ₽</p>
                  {inBasket ? (
                    <div>
                      <button onClick={() => decrementItem(el.id)}>-</button>
                      <span>{inBasket.count}</span>
                      <button onClick={() => incrementItem(el.id)}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => add(el)}>Купить</button>
                  )}
              </div>)
              })
          )}
        </div>

        {isFetchingNextPage && <p>Загрузка ещё...</p>}
        <div ref={loaderRef} style={{ height: 20 }}></div>
        {!hasNextPage && <p>Все товары загружены</p>}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCardRequest from 'components/ProductCardRequest';
import { useLocalStorage } from 'hooks';
import styles from './index.module.scss';

// TODO: refactor https://allalitvinenko.atlassian.net/browse/OS-185
const VisitedProducts = () => {
  const [visitedProducts, setVisitedProducts] = useState<string[]>([]);
  const { t } = useTranslation();
  const { productId } = useParams();

  useEffect(() => {
    const { getItem } = useLocalStorage<string[]>('visited', []);
    const visitedProduct = getItem();

    const visitedProductArray = visitedProduct
      ? visitedProduct.filter((item: string) => item !== productId).slice(0, 3)
      : [];

    setVisitedProducts(visitedProductArray);
  }, [productId]);

  return visitedProducts.length === 0 ? null : (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{t('viewedProducts')}</h1>
      <div className={styles.cardsWrapper}>
        <div className={styles.cardWrapper}>
          {visitedProducts.map((id: string) => (
            <div className={styles.card} key={id}>
              <ProductCardRequest id={id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisitedProducts;

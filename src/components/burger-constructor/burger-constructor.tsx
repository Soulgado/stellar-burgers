import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgersState,
  removeConstructorItems,
  removeCurrentOrder,
  TIngredientWithKey
} from '../../services/burgerReducer';
import { userState } from '../../services/userReducer';
import { orderBurger } from '../../services/burgerReducer';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const user = useSelector(userState).user;
  const navigate = useNavigate();
  const constructorItems = useSelector(burgersState).constructorItems;

  const orderRequest = useSelector(burgersState).orderBurgerLoading;

  const orderModalData = useSelector(burgersState).currentOrder;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) return navigate('/login');
    dispatch(
      orderBurger(
        constructorItems.ingredients.concat([
          constructorItems.bun,
          constructorItems.bun
        ])
      )
    );
  };
  const closeOrderModal = () => {
    dispatch(removeCurrentOrder());
    dispatch(removeConstructorItems());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredientWithKey) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

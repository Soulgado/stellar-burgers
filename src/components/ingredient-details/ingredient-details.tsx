import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { burgersState } from '../../services/burgerReducer';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const ingredientData = useSelector(burgersState).listOfIngedients.find(
    (i) => i._id === params.id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

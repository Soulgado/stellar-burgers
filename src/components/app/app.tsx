import { Route, Routes, BrowserRouter } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { ProtectedRoute } from 'src/pages/protected-route';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <BrowserRouter>
      <Routes>
        <Route path='\' element={<ConstructorPage />} />
        <Route path='\feed' element={<Feed />} />
        <Route
          path='\feed\:number'
          element={
            <Modal title={''} onClose={() => {}}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route path='\ingedients\:id' element={<IngredientDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path='\login' element={<Login />} />
          <Route path='\register' element={<Register />} />
          <Route path='\forgot-password' element={<ForgotPassword />} />
          <Route path='\reset-password' element={<ResetPassword />} />
          <Route path='\profile' element={<Profile />} />
          <Route path='\profile\orders' element={<ProfileOrders />} />
          <Route
            path='\profile\orders\:number'
            element={
              <Modal title={''} onClose={() => {}}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;

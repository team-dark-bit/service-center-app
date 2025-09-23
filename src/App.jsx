
/*import './App.css'
import Sidebar from './components/sidebar/Sidebar';
import CreateProduct from './components/products/CreateProduct/CreateProduct';

function App() {

  return (
    <>
      <div className="container">
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <CreateProduct />
        </div>
      </div >

    </>
  );
}

export default App*/

import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import { AppRoutes } from '../src/components/routes/AppRoutes';

function App() {
  return (
    <>
      <div className="container">
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <div className="content">
            <AppRoutes />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;


import './App.css'
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

export default App

import { useState } from 'react'
import './App.css'
import Sidebar from './components/sidebar/Sidebar';
import CreateProduct from './components/products/CreateProduct';

function App() {
  const [count, setCount] = useState(0);

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

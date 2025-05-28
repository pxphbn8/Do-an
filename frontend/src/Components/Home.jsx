import React from 'react';
import banner from '../../src/Components/assets/bg.jpg';



function Home() {


  return (
    <div className="hero">
      <div className="card bg-dark text-white border-0">
        <img src={banner} className="card-img" alt="Background" height="700px" />

      </div>
    </div>
  );
}

export default Home;

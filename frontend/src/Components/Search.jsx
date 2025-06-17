import React, { useState, useEffect } from 'react';

function Search({ setFilteredData }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setFilteredData(null); 
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/products/search?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setFilteredData(result); 
        } else {
          console.error("Expected array but got:", result); 
          setFilteredData([]); 
        }
      } catch (error) {
        console.error("Search API failed:", error);
        setFilteredData([]);
      }
    };

    fetchResults();
  }, [query, setFilteredData]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="d-flex">
      <input
        className="form-control me-2"
        type="search"
        placeholder="Tìm sản phẩm..."
        aria-label="Search"
        value={query}
        onChange={handleChange}
      />
      <button className="btn btn-outline-success" type="button">
        Tìm
      </button>
    </div>
  );
}

export default Search;

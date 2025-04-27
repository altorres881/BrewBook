import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import AirportTable from './components/AirportTable';
import BeerTable from './components/BeerTable';

export default function App() {
  const BATCH_SIZE = 50;

  const [beers,   setBeers]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [hasMore,    setHasMore]    = useState(true);

  // load a batch starting at `offset`
  const loadBatch = async (offset) => {
    setLoading(true);
    try {
      const res  = await fetch(
        `http://localhost:4000/beer?limit=${BATCH_SIZE}&offset=${offset}`
      );
      const data = await res.json();

      // append new rows
      setBeers(prev => [...prev, ...data]);

      // if we got fewer than we asked for, there's no more
      if (data.length < BATCH_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // on first mount, load the first batch
  useEffect(() => {
    loadBatch(0);
  }, []);

  // handler for "Load More" button
  const handleLoadMore = () => {
    loadBatch(beers.length);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Beer</h1>

      {beers.length === 0 && !loading && <p>No beers to display.</p>}
      {beers.length === 0 && loading && <p>Loading…</p>}

      {beers.length > 0 && <BeerTable data={beers} />}

      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  );
}
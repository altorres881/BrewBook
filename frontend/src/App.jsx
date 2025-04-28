import { useEffect, useState, useRef } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import AirportTable from './components/AirportTable';
import BeerTable from './components/BeerTable';
import CheckboxInputList from './components/CheckboxInputList';

const labels = [
  'Index',
  'Brewery ID',
  'Brewery Name',
  'Review Time',
  'Review Overall',
  'Review Aroma',
  'Review Appearance',
  'Review Profilename',
  'Beer Style',
  'Review Palate',
  'Review Taste',
  'Beer Name',
  'Beer Abreviation',
  'Beer ID',
];

// which of those should be dropdowns?
const numericLabels = ['Review Overall','Review Aroma','Review Appearance','Review Palate','Review Taste'];

// the options for every dropdown
const dropdownOptions = ['1+', '2+', '3+', '4+', '5'];

export default function App() {
  const BATCH_SIZE = 50;

  const [beers,   setBeers]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [hasMore,    setHasMore]    = useState(true);


  const [filters, setFilters] = useState(
    labels.map(() => ({ text: '', checked: false }))
  );

  const didLoadRef = useRef(false);
  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    loadBatch(0);
  }, []);

  // loadBatch now pulls in filters from App
  const loadBatch = async (offset = 0) => {
    setLoading(true);

    const params = new URLSearchParams({
      limit:  BATCH_SIZE,
      offset: offset
    });

    // append only the checked & nonempty filters
    filters.forEach((f, i) => {
      if (f.checked && f.text) {
        // convert your label to the exact query-param your API expects
        // e.g. 'Beer Name' → 'beer_name'
        const key = labels[i]
          .toLowerCase()
          .replace(/\s+/g, '_');
        params.append(key, f.text);
      }
    });

    try {
      const res  = await fetch(`http://localhost:4000/beer?${params}`);
      const data = await res.json();
      setBeers(prev => offset === 0 ? data : [...prev, ...data]);
      if (data.length < BATCH_SIZE) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Beers</h1>

      {/* 2) Pass App’s filters ↓ and setter ↓ into the component */}
      <CheckboxInputList
        labels={labels}
        numericLabels={numericLabels}
        dropdownOptions={dropdownOptions}
        rows={filters}
        setRows={setFilters}
      />

      {/* 3) Add your Apply Filters button */}
      <button
        onClick={() => {
          setBeers([]);      // clear out old results
          setHasMore(true);  // reset paging
          loadBatch(0);      // fetch with the new filters
        }}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? 'Applying…' : 'Apply Filters'}
      </button>

      {/* 4) Your table + Load More button */}
      <div className="mt-6">
        {beers.length > 0 && <BeerTable data={beers} />}
        {loading && <p>Loading…</p>}
        {!loading && hasMore && (
          <button
            onClick={() => loadBatch(beers.length)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
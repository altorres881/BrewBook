import React from 'react';

export default function BeerTable({ data }) {
  if (!data.length) {
    return <p>No airports to display.</p>;
  }

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">Index</th>
          <th className="border px-4 py-2">Brewery ID</th>
          <th className="border px-4 py-2">Brewery Name</th>
          <th className="border px-4 py-2">Review Time</th>
          <th className="border px-4 py-2">Review Overall</th>
          <th className="border px-4 py-2">Review Aroma</th>
          <th className="border px-4 py-2">Review Appearance</th>
          <th className="border px-4 py-2">Review Profile Name</th>
          <th className="border px-4 py-2">Beer Style</th>
          <th className="border px-4 py-2">Review Palate</th>
          <th className="border px-4 py-2">Review Taste</th>
          <th className="border px-4 py-2">Beer Name</th>
          <th className="border px-4 py-2">Beer Abreviation</th>
          <th className="border px-4 py-2">Beer ID</th>
          
        </tr>
      </thead>
      <tbody>
        {data.map((a) => (
          <tr key={a.id}>
            <td className="border px-4 py-2">{a.index}</td>
            <td className="border px-4 py-2">{a.brewery_id}</td>
            <td className="border px-4 py-2">{a.brewery_name}</td>
            <td className="border px-4 py-2">{a.review_time}</td>
            <td className="border px-4 py-2">{a.review_overall}</td>
            <td className="border px-4 py-2">{a.review_aroma}</td>
            <td className="border px-4 py-2">{a.review_appearance}</td>
            <td className="border px-4 py-2">{a.review_profilename}</td>
            <td className="border px-4 py-2">{a.beer_style}</td>
            <td className="border px-4 py-2">{a.review_palate}</td>
            <td className="border px-4 py-2">{a.review_taste}</td>
            <td className="border px-4 py-2">{a.beer_name}</td>
            <td className="border px-4 py-2">{a.beer_abv}</td>
            <td className="border px-4 py-2">{a.beer_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

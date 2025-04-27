import React from 'react';

export default function AirportTable({ data }) {
  if (!data.length) {
    return <p>Loading...</p>;
  }

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Latitude</th>
          <th className="border px-4 py-2">Longitude</th>
        </tr>
      </thead>
      <tbody>
        {data.map((a) => (
          <tr key={a.id}>
            <td className="border px-4 py-2">{a.name}</td>
            <td className="border px-4 py-2">{a.latitude}</td>
            <td className="border px-4 py-2">{a.longitude}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

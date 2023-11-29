import { supabase } from "../libs/supabaseClient";
import { useEffect, useState } from "react";
import MapComponent from "./Map";

export default function Table() {
  const [query, setQuery] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("Measurements").select();
      setQuery(data);
    }
    fetchData();
    
  }, []);

  return (
    <>
    <div className="p-4">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">ID station</th>
            <th className="py-2 px-4 border-b">Latitude</th>
            <th className="py-2 px-4 border-b">Longitude</th>
            <th className="py-2 px-4 border-b">Temperature</th>
            <th className="py-2 px-4 border-b">Humidity</th>
          </tr>
        </thead>
        <tbody>
          {query.map((item, index) => (
            <tr key={index} className={(index % 2 === 0 ? "bg-gray-100" : "bg-white")}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.station_id}</td>
              <td className="py-2 px-4 border-b">{item.latitude}</td>
              <td className="py-2 px-4 border-b">{item.longitude}</td>
              <td className="py-2 px-4 border-b">{item.temperature}</td>
              <td className="py-2 px-4 border-b">{item.humidity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <MapComponent localizaciones={query}></MapComponent>
    </div>
    </>
  );


}
'use client';

import { useState, useEffect } from "react";
import { firestore } from "../../config/firebase";
import { collection, getDocs } from 'firebase/firestore';

const TemperaturePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(firestore, "Vehicles/3MlPDEStfBZvXo6g6gFN/GPS_locations")
      );

      const items = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data().coordinates);
      });

      setData(items);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-col justify-center items-center shadow-md shadow-slate-400 p-6">
        <div className="flex flex-row gap-4">
          
          <h1 className="text-2xl">Vehicle Tracking System</h1>
        </div>
        <p className="flex items-center justify-center text-sm">{`Track your Vehicle's Location...`}</p>
      </div>
     <p>{data}</p>
    </div>
  );
};

export default TemperaturePage;
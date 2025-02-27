"use client";
import Image from "next/image";
import Map from "@/components/Map";

const TextField = ({ text }) => {
  return (
    <p className="w-full px-4 py-2 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center mb-2">
      {text}
    </p>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col text-white">
      <div className="flex flex-col justify-center items-center shadow-md shadow-slate-400 p-6">
        <div className="flex flex-row gap-4">
          <Image src="/logo.png" alt="Vehicle Icon" width={40} height={30} />
          <h1 className="text-2xl">Vehicle Tracking System</h1>
        </div>
        <p className="flex items-center justify-center text-sm">{`Track your Vehicle's Location...`}</p>
      </div>
      <div className="flex md:flex-row flex-col gap-2 md:gap-0 justify-center items-center">
        <div className="flex flex-col md:w-1/2 w-full p-4 md:p-0 items-center justify-center">
          <div className="backdrop-blur-lg bg-opacity-20 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 max-w-md w-full">
            <TextField
              text="This project aims to develop a specialized monitoring device to
              ensure the safe transportation of food and pharmaceutical items.
              The device helps maintain optimal temperature conditions, detect
              vehicle speed, and provide real-time location tracking using GPS.
              "
            />
            <TextField
              text={
                "Enhances vehicle and driver safety by detecting suspicious activities, monitoring accidents, and preventing unauthorized vehicle usage."
              }
            />
          </div>
        </div>
        <div className="flex md:w-2/3 w-full md:m-4 m-0">
          <Map />
        </div>
      </div>
    </div>
  );
}

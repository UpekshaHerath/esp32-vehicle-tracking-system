import Script from "next/script";

const GoogleMapsLoader = () => {
  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=&libraries=places`}
      strategy="beforeInteractive"
    />
  );
};

export default GoogleMapsLoader;

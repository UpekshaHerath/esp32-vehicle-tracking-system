// components/Spinner.js
const ErrorLoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error while loading maps...!!</p>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default ErrorLoadingSpinner;
  
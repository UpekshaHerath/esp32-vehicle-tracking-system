// components/Spinner.js
const LoadingSpinner = () => {
    return (
      <div className="flex w-2/3 items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  
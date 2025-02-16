import { useEffect } from "react";

const NotFound = () => {
  
  useEffect(() => {
    document.title = `SmartBuy - Error`;
  }, [])
  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="text-xl text-gray-700 mt-4">Oops! Page Not Found</p>
        <a
          href="/allProducts"
          className="mt-6 inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Go Back to Home
        </a>
      </div>
    </section>
  );
};

export default NotFound;

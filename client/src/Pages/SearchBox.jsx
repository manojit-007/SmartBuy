import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/Store/ProductSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [keywords, setKeywords] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywords.trim()) {
      navigate(`/allProducts/${keywords.trim()}`);
      dispatch(fetchProducts({ searchQuery: keywords, pageNo: 1 }));
    } else {
      navigate(`/allProducts`);
      dispatch(fetchProducts({}));
    }
  };

  return (
    <section className="flex w-full max-w-screen-lg items-center justify-center mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full gap-4 bg-white p-5 rounded-xl shadow-md"
      >
        <div className="flex w-full border border-gray-300 rounded-lg items-center gap-2  bg-gray-50">
          <Input
            id="search"
            type="text"
            placeholder="Search for products . . . "
            aria-label="Search for products..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="flex-1 bg-transparent ring-0 text-gray-950 placeholder-gray-400 border-none outline-none focus:ring-0 focus:border-none focus:outline-none focus-visible:ring-0"
          />
          <Button
            type="button"
            className={`px-4 py-0 bg-gray-50 text-black rounded shadow hover:bg-gray-200 transition ${keywords.length > 0 ? "" : "hidden"}`}
            onClick={() => setKeywords("")}
            disabled={!keywords.trim()}
            aria-label="Clear search"
          >
            X
          </Button>
        </div>
        <Button
          type="submit"
          className="p-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Search for products"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 fill-current text-white"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </Button>
      </form>
    </section>
  );
};

export default SearchBox;

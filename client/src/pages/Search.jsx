import { useLocation } from "react-router-dom";
import MovieGrid from "../../components/MovieGrid";

const Search = () => {
  const query = new URLSearchParams(useLocation().search).get("q");

  return (
    <div className='p-6'>
      <h1 className="text-2xl font-bold mb-4 text-black">
        Search results for: <span className="text-yellow-500">{query}</span>
      </h1>
        <MovieGrid/>
      {/* Later: map search results here */}
    </div>
  );
};

export default Search;

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q");

    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [location]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const assetsRef = collection(db, "assets");
      const q = query(
        assetsRef,
        where("tags", "array-contains", searchQuery.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {searchResults.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((asset) => (
            <Link to={`/asset/${asset.id}`} key={asset.id} className="block">
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{asset.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {asset.description.slice(0, 100)}...
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {asset.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;

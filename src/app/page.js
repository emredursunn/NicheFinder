"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [query, setQuery] = useState("");
  const [daysAgo, setDaysAgo] = useState(120);
  const [minSubscribers, setMinSubscribers] = useState(0);
  const [maxSubscribers, setMaxSubscribers] = useState(10000);
  const [minViews, setMinViews] = useState(10000);
  const [maxViews, setMaxViews] = useState(1000000000);
  const [region, setRegion] = useState("US");
  const [isSearched, setIsSearched] = useState(false);
  const [searchParams, setSearchParams] = useState(null); // Store search parameters here
  const [apiKey, setApiKey] = useState(""); // API key from localStorage or default

  const [isEditingApiKey, setIsEditingApiKey] = useState(false); // To toggle editing mode

// Client-side code to interact with localStorage
useEffect(() => {
  if (typeof window !== "undefined") {
    const storedApiKey = localStorage.getItem("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey); // Load API key from localStorage
    }
  }
}, []);

useEffect(() => {
  if (apiKey) {
    localStorage.setItem("apiKey", apiKey); // Save API key to localStorage when it changes
  }
}, [apiKey]);

  const toggleEditApiKey = () => {
    setIsEditingApiKey(!isEditingApiKey); // Toggle between view and edit mode
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  // API'yi çağıran fonksiyon
  const fetchChannels = async () => {
    const res = await fetch(
      `/api/youtube?query=${searchParams.query}&daysAgo=${searchParams.daysAgo}&minSubscribers=${searchParams.minSubscribers}&maxSubscribers=${searchParams.maxSubscribers}&minViews=${searchParams.minViews}&maxViews=${searchParams.maxViews}&region=${searchParams.region}&apiKey=${apiKey}`
    );
    return res.json();
  };

  // React Query ile API'yi çağır ve cache'le
  const { data, isLoading } = useQuery({
    queryKey: ["channels", searchParams], // Use searchParams as the queryKey
    queryFn: fetchChannels,
    enabled: !!searchParams, // Only run the query if searchParams is set
    staleTime: 1000 * 60 * 60 * 48, // 1 gün boyunca cache’de tut
    cacheTime: 1000 * 60 * 60 * 48, // 1 gün cache’de sakla
  });

  const handleSearch = () => {
    // Set searchParams when the user clicks "Search"
    if(apiKey){
      setSearchParams({
        query,
        daysAgo: Number(daysAgo),
        minSubscribers: Number(minSubscribers),
        maxSubscribers: Number(maxSubscribers),
        minViews: Number(minViews),
        maxViews: Number(maxViews),
        region,
      });
      setIsSearched(true); // Mark that a search has been performed
    }else{
      window.alert("Set an API KEY!")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 flex flex-col items-center p-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg text-center">📊 YouTube Niche Finder</h1>
      
      <div className="relative bg-white shadow-2xl rounded-2xl p-8 pt-16 w-full max-w-2xl flex flex-col items-center">

        {/* API Key input with edit/tick button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isEditingApiKey ? (
            <>
              <input
                type="text"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="border-2 border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={toggleEditApiKey}
                className="text-green-600 hover:text-green-800 cursor-pointer"
              >
                ✅
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-gray-700">{apiKey || "No API Key Set"}</span>
              <button
                onClick={toggleEditApiKey}
                className="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                ✏️
              </button>
            </>
          )}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">🔍 Niche Keyword</label>
            <input
              type="text"
              className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter niche keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">📅 Max Days Ago</label>
            <input
              type="number"
              className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              value={daysAgo}
              onChange={(e) => setDaysAgo(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">👥 Min Subscribers</label>
              <input
                type="number"
                className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={minSubscribers}
                onChange={(e) => setMinSubscribers(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">👥 Max Subscribers</label>
              <input
                type="number"
                className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={maxSubscribers}
                onChange={(e) => setMaxSubscribers(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">👀 Min Views</label>
              <input
                type="number"
                className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={minViews}
                onChange={(e) => setMinViews(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">👀 Max Views</label>
              <input
                type="number"
                className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={maxViews}
                onChange={(e) => setMaxViews(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">🌍 Region</label>
            <select
              className="p-3 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="US">United States (US)</option>
              <option value="TR">Turkey (TR)</option>
              <option value="DE">Germany (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="CA">Canada (CA)</option>
              <option value="ES">Spain (ES)</option>
              <option value="JP">Japan (JP)</option>
              <option value="AU">Australia (AU)</option>
              <option value="KR">South Korea (KR)</option>
              <option value="IT">Italy (IT)</option>
              <option value="CN">China (CN)</option>
              <option value="RU">Russia (RU)</option>
              <option value="BR">Brazil (BR)</option>
              <option value="MX">Mexico (MX)</option>
              <option value="NO">Norway (NO)</option>
              <option value="CH">Switzerland (CH)</option>
              <option value="PL">Poland (PL)</option>
              <option value="CZ">Czech Republic (CZ)</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={isLoading}
          >
            🚀 Search
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 text-white flex items-center justify-center space-x-3">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      )}

      <div className="mt-6 w-full max-w-2xl flex justify-center">
        {!isSearched ? (
          <p className="text-white text-lg">🔍 Start by searching for a niche!</p>
        ) : data?.channels?.length > 0 ? (
          <ul className="space-y-4 w-full">
            {data.channels.map((channel, index) => (
              <li
                key={index}
                className="bg-white rounded-lg shadow-md flex items-center w-full p-4 hover:shadow-lg transition duration-300"
              >
                <img
                  src={channel.snippet.thumbnails.default.url}
                  alt={channel.snippet.title}
                  className="w-16 h-16 rounded-full mr-4 md:mr-8"
                  onError={(e) => e.target.src = "/user.png"} // default image
                />
                <div className="flex flex-col">
                  <a
                    href={`https://www.youtube.com/channel/${channel.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {channel.snippet.title}
                  </a>
                  <p className="text-sm text-gray-600">👥 Subscribers: {channel.statistics.subscriberCount}</p>
                  <p className="text-sm text-gray-600">👀 Total Views: {channel.statistics.viewCount}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white font-semibold mt-4">⚠️ No channels found with the current filters.</p>
        )}
      </div>
    </div>
  );
}
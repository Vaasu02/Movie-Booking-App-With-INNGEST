import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../hooks/useAppContext";
import { Loader } from "lucide-react";

const Movies = () => {
  const { shows } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shows !== undefined) {
      setLoading(false);
    }
  }, [shows]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-400">Loading movies...</p>
      </div>
    );
  }

  return shows?.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 1g:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />
      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows?.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No movies available</h1>
    </div>
  );
};

export default Movies;

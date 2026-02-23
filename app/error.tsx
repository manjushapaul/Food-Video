'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 text-center max-w-md mb-6">
        We couldn’t load this part of the page. You can try again or continue browsing.
      </p>
      <button
        onClick={reset}
        className="bg-[#A62B3A] hover:bg-[#8B2330] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

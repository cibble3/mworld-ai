import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default function useCategories() {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false, // Disable revalidation on window focus
    shouldRetryOnError: false // Optional: Disable retries on error
  });
  const { data: filterData } = useSWR('/api/models?extractAttributes=true', fetcher, {
    revalidateOnFocus: false, // Disable revalidation on window focus
    shouldRetryOnError: false // Optional: Disable retries on error
  });
  console.log('data :>> ', filterData);

  return {
    categories: data?.data?.categories || [],
    isLoading,
    isError: error,
    error // Expose the error object for more detailed handling if needed
  };
} 
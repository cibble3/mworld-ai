// pages/i18n/lang.js - Moved from [lang].js to resolve routing conflicts

import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { lang } = router.query;
    // Check if the route consists only of the language code
    if (lang && lang !== "en") {
      router.push("/");
    } else {
      // Default redirect if no language is specified
      router.push("/");
    }
  }, [router.query]);

  return null; // This component does not render anything
};

export default RedirectPage;

// This page now accepts a query parameter ?lang=xx instead of being a dynamic route
// Example: /i18n/lang?lang=fr

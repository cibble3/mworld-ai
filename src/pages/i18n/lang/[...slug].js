// pages/[lang]/[...slug].js

import { useRouter } from "next/router";
import { useEffect } from "react";
import ThemeLayout from "@/theme/layouts/ThemeLayout";

const RedirectPage = () => {
  const router = useRouter();
  
  // Don't render anything until router is ready
  if (!router.isReady) {
    return (
      <ThemeLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      </ThemeLayout>
    );
  }

  useEffect(() => {
    const { lang, slug } = router.query;

    if (lang) {
      if (!slug || slug.length === 0) {
        // If only language is provided, redirect to home page
        router.push("/");
      } else {
        const [firstSegment, ...remainingSegments] = slug;
        if (
          firstSegment === "girls" ||
          firstSegment === "trans" ||
          firstSegment === "blog" ||
          (firstSegment.startsWith("free") && slug[1] === "girls") ||
          (firstSegment.startsWith("free") && slug[1] === "trans")
        ) {
          // Redirect to the route with the remaining segments
          router.push(
            `/${firstSegment}${
              remainingSegments.length > 0
                ? "/" + remainingSegments.join("/")
                : ""
            }`
          );
        } else {
          // Redirect to the home page for unknown routes
          router.push("/404");
        }
      }
    }
  }, [router.query, router.isReady]);

  // Return a minimal ThemeLayout to avoid theme context errors during SSR
  return (
    <ThemeLayout meta={{ meta_title: "Redirecting...", meta_desc: "Please wait while you are redirected." }}>
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    </ThemeLayout>
  );
};

export default RedirectPage;

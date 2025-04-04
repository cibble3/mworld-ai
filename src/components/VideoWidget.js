import React, { useEffect, useRef } from "react";

const VideoWidget = ({ playerEmbedUrl, performerId }) => {
  const objectContainerRef = useRef(null);

  function loadVideoWidget() {
    let videoLoadIframe = document.getElementById("videoLoadIframe");
    if (videoLoadIframe) {
      videoLoadIframe.remove();
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("id", "videoLoadIframe");

      // Clean and validate the URL
      let cleanUrl = playerEmbedUrl;
      if (!cleanUrl) {
        console.error("No video URL provided");
        return;
      }

      // Ensure URL starts with https: or http:
      if (cleanUrl.startsWith('//')) {
        cleanUrl = `https:${cleanUrl}`;
      }

      // Add required parameters if they're missing
      const url = new URL(cleanUrl);
      if (!url.searchParams.has('site')) {
        url.searchParams.append('site', 'wl3');
      }
      if (!url.searchParams.has('cobrandId')) {
        url.searchParams.append('cobrandId', '201300');
      }
      if (performerId) {
        url.searchParams.append('performerId', performerId);
      }

      iframe.setAttribute("src", url.toString());
      iframe.setAttribute("allowfullscreen", "true");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";

      objectContainerRef.current.innerHTML = ""; // Clear previous content
      objectContainerRef.current.appendChild(iframe);
    } catch (error) {
      console.error("Error loading video widget:", error);
      // Show error message in the container
      if (objectContainerRef.current) {
        objectContainerRef.current.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(0,0,0,0.8);">
            <p style="color: white; text-align: center;">Error loading video. Please try again later.</p>
          </div>
        `;
      }
    }
  }

  function videoWidget() {
    let w = Math.abs(0.81 * window.outerWidth);
    if (window.innerWidth < 991) {
      w = Math.abs(0.95 * window.outerWidth);
    }

    if (window.innerWidth > 851 && window.innerWidth < 1368) {
      w = Math.abs(0.9 * window.outerWidth);
    }

    const h = Math.abs(0.52 * w);
    if (objectContainerRef.current) {
      objectContainerRef.current.style.width = `${w}px`;
      objectContainerRef.current.style.height = `${h}px`;
    }

    // Call loadVideoWidget after the iframe element has been added
    setTimeout(loadVideoWidget, 0);
  }

  useEffect(() => {
    if (playerEmbedUrl) {
      videoWidget();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [playerEmbedUrl]);

  function handleResize() {
    videoWidget();
  }

  if (!playerEmbedUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <p className="text-white">No video URL available</p>
      </div>
    );
  }

  return (
    <div id="model-chat" className="model-tab-content">
      <div id="chat-block">
        <div
          data-awe-container-id="CONTAINER"
          id="promo-container"
          ref={objectContainerRef}
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default VideoWidget;

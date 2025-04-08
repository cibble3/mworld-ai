import React, { useEffect, useRef } from "react";

const VideoWidget = ({ playerEmbedUrl }) => {
  const objectContainerRef = useRef(null);

  function loadVideoWidget() {
    if (!objectContainerRef.current) return;
    
    // If no playerEmbedUrl provided or invalid, show placeholder
    if (!playerEmbedUrl || typeof playerEmbedUrl !== 'string') {
      objectContainerRef.current.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#000;">
          <div style="text-align:center; color:#fff;">
            <p>Video preview not available</p>
          </div>
        </div>
      `;
      return;
    }
    
    let videoLoadIframe = document.getElementById("videoLoadIframe");
    if (videoLoadIframe) {
      videoLoadIframe.remove();
    }

    // Process the player URL with null check
    let processedUrl = playerEmbedUrl;
    
    // Process {CONTAINER} placeholder if it exists
    if (playerEmbedUrl.includes("{CONTAINER}")) {
      processedUrl = playerEmbedUrl.replace("{CONTAINER}", "videoLoadContainer");
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("id", "videoLoadIframe");
    iframe.setAttribute("src", processedUrl);
    iframe.setAttribute("allowfullscreen", "true");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    objectContainerRef.current.innerHTML = ""; // Clear previous content
    objectContainerRef.current.appendChild(iframe);
  }

  function videoWidget() {
    if (!objectContainerRef.current) return;
    
    let w = Math.abs(0.81 * window.outerWidth);
    if (window.innerWidth < 991) {
      w = Math.abs(0.95 * window.outerWidth);
    }

    if (window.innerWidth > 851 && window.innerWidth < 1368) {
      w = Math.abs(0.9 * window.outerWidth);
    }

    const h = Math.abs(0.52 * w);
    objectContainerRef.current.style.width = `${w}px`;
    objectContainerRef.current.style.height = `${h}px`;

    // Call loadVideoWidget after the iframe element has been added
    setTimeout(loadVideoWidget, 0);
  }

  useEffect(() => {
    if (objectContainerRef.current) {
      videoWidget("object_container");
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [playerEmbedUrl]);

  function handleResize() {
    videoWidget("object_container");
  }

  return (
    <div id="model-chat" className="model-tab-content">
      <div id="chat-block">
        <div
          id="videoLoadContainer"
          data-awe-container-id="object_container"
          ref={objectContainerRef}
          style={{ width: "100%", height: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default VideoWidget;

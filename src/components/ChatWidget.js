import React, { useEffect, useState } from "react";

const ChatWidget = ({ performerId }) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    var s = document.createElement("script");
    s.setAttribute(
      "src",
      `https://awempt.com/embed/lfcht?c=object_container&site=wl3&cobrandId=201300&psid=mikeeyy3&pstool=320_1&psprogram=cbrnd&campaign_id=&category=&forcedPerformers[]=${performerId}&vp[showChat]=true&vp[chatAutoHide]=false&vp[showCallToAction]=true&vp[showPerformerName]=false&vp[showPerformerStatus]=false&ctaLabelKey=udmn&landingTarget=freechat&filters=&subAffId=${performerId}-mistressworld-chat`
    );
    s.onerror = (event) => {
      console.error("Error loading script:", event);
      setError(true);
    };
    document.body.appendChild(s);
  }, []);
  return (
    <>
      {/* {!error ? ( */}
      <div
        id="model-chat "
        className="model-tab-content"
        style={{ width: "100%", height: "100%" }}
      >
        <div id="chat-block" style={{ width: "100%", height: "100%" }}>
          <div
            id="object_container"
            style={{ width: "100%", height: "100%" }}
          ></div>
        </div>
      </div>
      {/* ) : (
        ""
      )} */}
    </>
  );
};

export default ChatWidget;

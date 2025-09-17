// YoutubeEmbed.js (JSX 내부에서 스타일 props 적용)
const YoutubeEmbed = ({ width = "100%", maxWidth = "400px" }) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        maxWidth,
        margin: "1.5rem auto",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <iframe
        src="https://www.youtube.com/embed/zNSzds_gQs8?si=HOwW2pcE6JsqrptJ"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default YoutubeEmbed;

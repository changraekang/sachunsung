import totoro_1 from "../assets/images/totoro-1.png";
import totoro_2 from "../assets/images/totoro-2.png";
import totoro_3 from "../assets/images/totoro-3.png";
import totoro_4 from "../assets/images/totoro-4.png";
const CustomSvgIcon = () => (
  <svg
    height="25px"
    width="25px"
    viewBox="0 0 512 512"
    fill="#000000"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M256,0C114.608,0.018,0.018,114.598,0,256c0.018,141.392,114.608,255.982,256,256 
        c141.393-0.018,255.982-114.608,256-256C511.982,114.598,397.393,0.018,256,0z 
        M404.696,404.697 
        c-38.134,38.089-90.554,61.571-148.696,61.589
        c-58.143-0.018-110.571-23.5-148.697-61.589 
        C69.214,366.572,45.724,314.143,45.714,256
        c0.009-58.143,23.5-110.571,61.589-148.697
        C145.429,69.214,197.857,45.724,256,45.714 
        c58.143,0.009,110.563,23.5,148.696,61.589 
        c38.089,38.126,61.58,90.554,61.589,148.697 
        C466.277,314.143,442.786,366.572,404.696,404.697z"
      />
      <polygon points="185.169,165.33 185.169,373.027 211.134,373.027 211.134,282.16 347.429,282.16 347.429,165.33 211.134,165.33" />
    </g>
  </svg>
);
const totoroImages = [totoro_2, totoro_3, totoro_4];

export default function TotoroLoading({ count = 1 }) {
  const getImages = () => {
    const images = Array(6).fill(totoro_4); // 처음에 totoro_4로 채움
    if(count > 0) {
      images[count] = totoro_2;
      images[count - 1] = totoro_3;
    } else {
      images[0] = totoro_2;
    }

    return images;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexDirection: "row",
        width: "100%",
      }}
    >
      {getImages().map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`totoro-${index + 1}`}
          style={{
            width: src !== totoro_4 ? "50px" : "25px",
            height: src !== totoro_4 ? "50px" : "25px",
            marginTop: src !== totoro_4 ? "0px" : "20px",
          }}
        />
      ))}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CustomSvgIcon />
        Goal!
      </div>
    </div>
  );
}

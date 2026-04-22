import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

interface Props {
  alt?: string;
  video?: string;
  link?: string;
  title: string;
  category: string;
  technologies: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const palette = useMemo(() => {
    if (props.category === "AI/ML") {
      return {
        glow: "#99f6e4",
        accent: "#5eead4",
        accentSoft: "rgba(94, 234, 212, 0.18)",
      };
    }
    if (props.category === "Mobile App") {
      return {
        glow: "#fdba74",
        accent: "#fb923c",
        accentSoft: "rgba(251, 146, 60, 0.18)",
      };
    }
    if (props.category === "Frontend") {
      return {
        glow: "#f9a8d4",
        accent: "#f472b6",
        accentSoft: "rgba(244, 114, 182, 0.18)",
      };
    }
    return {
      glow: "#93c5fd",
      accent: "#60a5fa",
      accentSoft: "rgba(96, 165, 250, 0.18)",
    };
  }, [props.category]);

  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link || "#"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        rel="noreferrer"
        data-cursor={"disable"}
      >
        <div
          className="work-art"
          aria-label={props.alt}
          style={
            {
              "--workGlow": palette.glow,
              "--workAccent": palette.accent,
              "--workAccentSoft": palette.accentSoft,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 520 320" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="work-panel" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#141414" />
                <stop offset="100%" stopColor="#090909" />
              </linearGradient>
            </defs>
            <rect x="12" y="12" width="496" height="296" rx="28" fill="url(#work-panel)" />
            <rect
              x="36"
              y="42"
              width="448"
              height="42"
              rx="21"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.08)"
            />
            <rect x="54" y="58" width="118" height="10" rx="5" fill={palette.accent} />
            <rect x="326" y="57" width="122" height="12" rx="6" fill="rgba(255,255,255,0.08)" />
            <rect x="36" y="108" width="190" height="140" rx="24" fill={palette.accentSoft} />
            <rect x="252" y="108" width="232" height="26" rx="13" fill="rgba(255,255,255,0.08)" />
            <rect x="252" y="148" width="204" height="16" rx="8" fill="rgba(255,255,255,0.16)" />
            <rect x="252" y="177" width="172" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
            <rect x="252" y="206" width="146" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
            <circle cx="106" cy="178" r="36" fill="rgba(255,255,255,0.06)" />
            <path
              d="M79 181c12-10 21-15 27-15 10 0 15 7 22 7 7 0 13-5 21-13"
              fill="none"
              stroke={palette.glow}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <rect x="36" y="266" width="138" height="16" rx="8" fill="rgba(255,255,255,0.12)" />
            <rect x="188" y="266" width="92" height="16" rx="8" fill={palette.accent} />
          </svg>
        </div>
        <div className="work-art-copy">
          <span>{props.category}</span>
          <strong>{props.title}</strong>
          <p>{props.technologies}</p>
        </div>
        {isVideo && <video src={video} autoPlay muted playsInline loop></video>}
      </a>
    </div>
  );
};

export default WorkImage;

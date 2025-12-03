import React, { ReactNode } from "react";

interface CircularTextComponentProps {
  text: string;
  radius?: number;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  children?: ReactNode; // contenu central (avatar, icône, etc.)
}

const CircularTextComponent: React.FC<CircularTextComponentProps> = ({
  text,
  radius = 75,
  fontSize = 14,
  fontWeight = "bold",
  color = "black",
  children,
}) => {
  // Génère un ID unique pour le path
  const pathId = `circlePath-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ position: "relative", width: radius * 2, height: radius * 2 }}>
      {/* Élément central */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
        }}
      >
        {children}
      </div>

      {/* Text in circle */}
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        width={radius * 2}
        height={radius * 2}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
         <defs>
          <path
            id={pathId}
            d={`
              M ${radius - (radius - 10)}, ${radius}
              a ${radius - 10},${radius - 10} 0 0,0 ${2 * (radius - 10)},0
            `}
          />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
        >
          <textPath href={`#${pathId}`} startOffset="50%">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularTextComponent;

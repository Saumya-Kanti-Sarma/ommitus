import React from "react";
import "./TypingAnimation.css";

interface TypingAnimationProps {
  text: string;
  color?: string;
  extraStyles?: string;
  cursorColor?: string;
  duration?: number; // total duration in ms
}

const TypingAnimation = ({
  text,
  color = "#fff",
  cursorColor = "#fff",
  extraStyles = "",
  duration = 1200
}: TypingAnimationProps) => {
  return (
    <h1
      className={`typing ${extraStyles}`}
      style={{
        "--typing-duration": `${duration}ms`,
        "--text-color": color,
        "--cursor-color": cursorColor
      } as React.CSSProperties}
    >
      {text}
    </h1>
  );
};

export default TypingAnimation;

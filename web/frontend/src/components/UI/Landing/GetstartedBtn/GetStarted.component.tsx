"use client";
import "./GetStarted.css";
import Link from "next/link";

interface getStartedBtnProps {
  fontSize?: string,
  borderRadius?: string,
  width?: string,
}

const GetStartedBtn = ({
  fontSize, borderRadius, width
}: getStartedBtnProps) => {
  return (
    <Link
      target="blank"
      href="/auth/get-started"
      className={`get-started-btn bg-white text-[var(--black)] px-4 py-1 rounded-md font-medium text-center`}
      style={{
        fontSize,
        borderRadius,
        width
      }}
    >
      Get Started
    </Link>
  )
}

export default GetStartedBtn

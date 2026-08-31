import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#090909", color: "#ffffff", fontSize: 22, fontWeight: 700, letterSpacing: "-1px" }}>
      A<span style={{ color: "#2455ff" }}>-</span>T
    </div>,
    size,
  );
}

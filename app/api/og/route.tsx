import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

const INK = "#0b0b0f";
const ACCENT = "#c8ff3d";
const FG = "#f7f7f8";
const MUTED = "#a3a3ad";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Clamp lengths so a long title can't blow the layout apart.
  const title = (searchParams.get("title") ?? site.name).slice(0, 110);
  const subtitle = searchParams.get("subtitle")?.slice(0, 120);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: "72px",
        position: "relative",
      }}
    >
      {/* Accent bloom */}
      <div
        style={{
          position: "absolute",
          top: -220,
          left: -120,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: "rgba(200,255,61,0.14)",
          filter: "blur(120px)",
        }}
      />

      {/* Brand row */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 15,
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 32 32">
            <g
              stroke={INK}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M8 7v17h17" />
              <path d="M12.5 19.5 17 14l3.5 3.5L25 11" />
            </g>
          </svg>
        </div>
        {/* satori requires an explicit display on any element with more than
              one child, so this is a flex row of two spans rather than mixed
              text + span content. */}
        <div
          style={{
            display: "flex",
            gap: 9,
            fontSize: 27,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: FG }}>Axis Global</span>
          <span style={{ color: MUTED, fontWeight: 500 }}>Consultants</span>
        </div>
      </div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div
          style={{
            fontSize: title.length > 60 ? 62 : 78,
            fontWeight: 700,
            color: FG,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 26,
              fontSize: 30,
              color: MUTED,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Footer rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 26,
        }}
      >
        <div style={{ fontSize: 24, color: MUTED }}>
          UK · Canada · Australia · Uzbekistan
        </div>
        <div style={{ fontSize: 24, color: ACCENT, fontWeight: 600 }}>
          axisglobalpk.com
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

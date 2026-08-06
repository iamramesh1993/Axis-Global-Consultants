import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

const PAGE = "#ffffff";
const PANEL = "#f8fafc";
const BRAND = "#2563eb";
const BRAND_TINT = "#eff6ff";
const INK = "#0f172a";
const INK_MUTED = "#475569";
const LINE = "#e2e8f0";

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
        background: PAGE,
        padding: "72px",
        position: "relative",
      }}
    >
      {/* Soft brand tint, top-right */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -180,
          width: 680,
          height: 680,
          borderRadius: 9999,
          background: BRAND_TINT,
        }}
      />

      {/* Brand row */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 15,
            background: BRAND,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="42" height="42" viewBox="0 0 48 48">
            <path
              d="M24 10.5 35.5 38h-5.2l-2.3-5.9h-8l-2.3 5.9H12.5L24 10.5Zm0 10.4-2.6 6.7h5.2L24 20.9Z"
              fill="#ffffff"
            />
            <path
              d="M9.5 36.5c7.5.6 15.5-3.2 21-8.6 2.5-2.4 4.4-5 5.8-7.4"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M35.2 15.6 39.6 14l-1.3 4.3-2.4 1.1-1.4-1.3.7-2.5Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        {/* satori needs an explicit display on any element with >1 child */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div
            style={{ display: "flex", gap: 9, fontSize: 30, fontWeight: 800 }}
          >
            <span style={{ color: INK }}>Axis</span>
            <span style={{ color: BRAND }}>Global</span>
          </div>
          <div
            style={{
              fontSize: 15,
              letterSpacing: "0.16em",
              color: INK_MUTED,
              fontWeight: 600,
            }}
          >
            YOUR GLOBAL EDUCATION PARTNER
          </div>
        </div>
      </div>

      {/* Title block */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div
          style={{
            fontSize: title.length > 60 ? 60 : 74,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 24,
              fontSize: 29,
              color: INK_MUTED,
              lineHeight: 1.4,
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
          borderTop: `1px solid ${LINE}`,
          paddingTop: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 23,
            color: INK_MUTED,
          }}
        >
          <span
            style={{
              display: "flex",
              background: PANEL,
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            UK · Canada · Australia · Uzbekistan
          </span>
        </div>
        <div style={{ fontSize: 23, color: BRAND, fontWeight: 700 }}>
          axisglobalpk.com
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

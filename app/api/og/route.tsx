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
  const url = new URL(request.url);
  const { searchParams } = url;
  const origin = url.origin;

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

      {/* Brand row — the supplied lockup, fetched from this origin. satori has no
          filesystem on the edge runtime, and using the request origin keeps
          preview deployments working as well as production. */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${origin}/brand/logo-lockup.png`}
          alt="Axis Global Consultants"
          height={62}
          width={227}
        />
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

/**
 * Dates are formatted with an explicit UTC timezone so the server-rendered
 * string and the client-hydrated string always match. Without it a visitor in
 * Karachi can see a different date than the build produced, which React reports
 * as a hydration mismatch.
 */
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(`${iso}T00:00:00Z`));
}

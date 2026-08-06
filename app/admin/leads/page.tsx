import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  LogOut,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { WhatsappIcon } from "@/components/site/social-icons";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLeads } from "@/lib/leads-query";

export const metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

/** Never cache — the whole point is seeing what came in a minute ago. */
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function formatWhen(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Karachi",
  }).format(date);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    country?: string;
    intake?: string;
    q?: string;
    page?: string;
  }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login?error=expired");

  const params = await searchParams;
  const page = Math.max(Number(params.page ?? "1") || 1, 1);
  const filters = {
    country: params.country || undefined,
    intake: params.intake || undefined,
    q: params.q?.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const { rows, total, countries, intakes, configured } =
    await getLeads(filters);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const hasFilters = Boolean(filters.country || filters.intake || filters.q);

  const exportQuery = new URLSearchParams();
  if (filters.country) exportQuery.set("country", filters.country);
  if (filters.intake) exportQuery.set("intake", filters.intake);
  if (filters.q) exportQuery.set("q", filters.q);
  const exportHref = `/api/admin/leads.csv${
    exportQuery.size > 0 ? `?${exportQuery.toString()}` : ""
  }`;

  const pageHref = (target: number) => {
    const next = new URLSearchParams(exportQuery);
    if (target > 1) next.set("page", String(target));
    return `/admin/leads${next.size > 0 ? `?${next.toString()}` : ""}`;
  };

  return (
    <div className="bg-panel min-h-screen">
      {/* Admin bar — deliberately distinct from the marketing header */}
      <div className="border-line bg-card border-b">
        <div className="container-page flex h-18 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo height={38} />
            <span className="bg-brand-tint text-brand hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline">
              Leads
            </span>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-control border-line text-ink-muted hover:border-brand hover:text-brand inline-flex h-10 items-center gap-2 border px-4 text-sm font-semibold transition-colors"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] font-extrabold tracking-[-0.025em]">
              Leads
            </h1>
            <p className="text-ink-muted mt-1.5 text-[0.9375rem]">
              {configured
                ? `${total} ${total === 1 ? "enquiry" : "enquiries"}${
                    hasFilters ? " matching your filters" : " in total"
                  }`
                : "Database not connected"}
            </p>
          </div>

          {configured && total > 0 && (
            <a
              href={exportHref}
              className="rounded-control bg-brand text-on-brand hover:bg-brand-hover inline-flex h-11 items-center gap-2 px-5 text-[0.9375rem] font-semibold transition-colors duration-200"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </a>
          )}
        </div>

        {/* Filters — a plain GET form, so every view is a shareable URL */}
        <form
          method="GET"
          className="rounded-card border-line bg-card mt-7 grid gap-3 border p-5 shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_auto_auto_auto]"
        >
          <div className="relative">
            <Search
              className="text-ink-subtle pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <label htmlFor="q" className="sr-only">
              Search name, email or phone
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={params.q ?? ""}
              placeholder="Search name, email or phone"
              className="rounded-control border-line-strong bg-card text-ink focus:border-brand focus:ring-brand-light h-11 w-full border pr-4 pl-11 text-base transition-[border-color,box-shadow] duration-200 outline-none focus:ring-4 md:text-[0.9375rem]"
            />
          </div>

          <div>
            <label htmlFor="country" className="sr-only">
              Destination
            </label>
            <select
              id="country"
              name="country"
              defaultValue={params.country ?? ""}
              className="rounded-control border-line-strong bg-card text-ink focus:border-brand focus:ring-brand-light h-11 w-full border px-4 text-base transition-[border-color,box-shadow] duration-200 outline-none focus:ring-4 sm:w-40 md:text-[0.9375rem]"
            >
              <option value="">All destinations</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="intake" className="sr-only">
              Intake
            </label>
            <select
              id="intake"
              name="intake"
              defaultValue={params.intake ?? ""}
              className="rounded-control border-line-strong bg-card text-ink focus:border-brand focus:ring-brand-light h-11 w-full border px-4 text-base transition-[border-color,box-shadow] duration-200 outline-none focus:ring-4 sm:w-44 md:text-[0.9375rem]"
            >
              <option value="">All intakes</option>
              {intakes.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-control bg-brand text-on-brand hover:bg-brand-hover h-11 px-5 text-[0.9375rem] font-semibold transition-colors duration-200"
            >
              Filter
            </button>
            {hasFilters && (
              <Link
                href="/admin/leads"
                className="rounded-control border-line text-ink-muted hover:border-brand hover:text-brand inline-flex h-11 items-center border px-4 text-[0.9375rem] font-semibold transition-colors"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Results */}
        {!configured ? (
          <EmptyState
            title="Database not connected"
            body="DATABASE_URL is not set for this environment, so there is nothing to read. Leads submitted while it is unset are not stored."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No leads match those filters" : "No leads yet"}
            body={
              hasFilters
                ? "Try clearing the filters, or widen the search."
                : "When a student submits the assessment form it will appear here immediately."
            }
          />
        ) : (
          <>
            {/* Cards on mobile — a wide table is unusable on a phone, and this
                dashboard will mostly be opened on one. */}
            <ul className="mt-6 grid gap-4 lg:hidden">
              {rows.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-card border-line bg-card border p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold tracking-[-0.01em]">
                      {lead.fullName}
                    </p>
                    <span className="bg-brand-tint text-brand shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold">
                      {lead.targetCountry}
                    </span>
                  </div>

                  <p className="text-ink-subtle mt-1 text-xs">
                    {formatWhen(lead.createdAt)} · {lead.intake}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ContactChip
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                      external
                      label="WhatsApp"
                    >
                      <WhatsappIcon className="h-4 w-4" />
                    </ContactChip>
                    <ContactChip href={`tel:${lead.phone}`} label={lead.phone}>
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </ContactChip>
                    <ContactChip href={`mailto:${lead.email}`} label="Email">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </ContactChip>
                  </div>

                  <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
                    <Row label="Email" value={lead.email} />
                    <Row label="Qualification" value={lead.qualification} />
                    {lead.budgetRange && (
                      <Row label="Budget" value={lead.budgetRange} />
                    )}
                    {lead.message && (
                      <Row label="Message" value={lead.message} />
                    )}
                    {lead.source && <Row label="Source" value={lead.source} />}
                  </dl>
                </li>
              ))}
            </ul>

            {/* Table from lg */}
            <div className="rounded-card border-line bg-card mt-6 hidden overflow-hidden border shadow-[var(--shadow-soft)] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-line bg-panel border-b">
                      {[
                        "Received",
                        "Name",
                        "Contact",
                        "Destination",
                        "Intake",
                        "Qualification",
                        "Budget",
                        "Message",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-ink px-4 py-3 text-xs font-bold tracking-wide whitespace-nowrap uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-line hover:bg-brand-tint/40 border-b align-top transition-colors last:border-b-0"
                      >
                        <td className="text-ink-subtle px-4 py-4 text-xs whitespace-nowrap">
                          {formatWhen(lead.createdAt)}
                        </td>
                        <td className="px-4 py-4 font-semibold whitespace-nowrap">
                          {lead.fullName}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand inline-flex items-center gap-1.5 font-medium hover:underline"
                            >
                              <WhatsappIcon className="h-3.5 w-3.5" />
                              {lead.phone}
                            </a>
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-ink-muted hover:text-brand text-xs"
                            >
                              {lead.email}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="bg-brand-tint text-brand rounded-full px-2.5 py-1 text-xs font-semibold">
                            {lead.targetCountry}
                          </span>
                        </td>
                        <td className="text-ink-muted px-4 py-4 whitespace-nowrap">
                          {lead.intake}
                        </td>
                        <td className="text-ink-muted px-4 py-4">
                          {lead.qualification}
                        </td>
                        <td className="text-ink-muted px-4 py-4">
                          {lead.budgetRange ?? "—"}
                        </td>
                        <td className="text-ink-muted max-w-xs px-4 py-4">
                          {lead.message ? (
                            <span className="line-clamp-3">{lead.message}</span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-7 flex items-center justify-between gap-4"
              >
                <PageLink
                  href={pageHref(page - 1)}
                  disabled={page <= 1}
                  direction="prev"
                />
                <p className="text-ink-muted text-sm">
                  Page {page} of {totalPages}
                </p>
                <PageLink
                  href={pageHref(page + 1)}
                  disabled={page >= totalPages}
                  direction="next"
                />
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="text-ink-subtle w-24 shrink-0 text-xs">{label}</dt>
      <dd className="text-ink-muted min-w-0 break-words">{value}</dd>
    </div>
  );
}

function ContactChip({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="rounded-control border-line text-brand hover:border-brand hover:bg-brand hover:text-on-brand inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition-colors"
    >
      {children}
      {label}
    </a>
  );
}

function PageLink({
  href,
  disabled,
  direction,
}: {
  href: string;
  disabled: boolean;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Previous" : "Next";
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  if (disabled) {
    return (
      <span className="rounded-control border-line text-ink-subtle inline-flex h-10 items-center gap-2 border px-4 text-sm font-semibold opacity-50">
        {direction === "prev" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
        {label}
        {direction === "next" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-control border-line text-ink hover:border-brand hover:text-brand inline-flex h-10 items-center gap-2 border px-4 text-sm font-semibold transition-colors"
    >
      {direction === "prev" && <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
      {direction === "next" && <Icon className="h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border-line bg-card mt-6 border px-6 py-16 text-center shadow-[var(--shadow-soft)]">
      <span
        aria-hidden="true"
        className="bg-brand-tint mx-auto grid h-14 w-14 place-items-center rounded-full"
      >
        <Inbox className="text-brand h-6 w-6" />
      </span>
      <h2 className="mt-5 text-lg font-bold tracking-[-0.015em]">{title}</h2>
      <p className="text-ink-muted mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

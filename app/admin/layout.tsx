/**
 * Admin pages carry no marketing chrome — no public nav, no footer, no
 * "Book a free assessment" CTA. Each admin page supplies its own bar.
 *
 * The <main> landmark still has to exist here: the skip link in the root layout
 * targets #main, and the marketing layout is what used to provide it.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main id="main">{children}</main>;
}

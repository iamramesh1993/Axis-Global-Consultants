import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-28 text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] first:mt-0"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-10 scroll-mt-28 text-xl leading-snug font-bold tracking-[-0.015em]"
    />
  ),
  p: (props) => <p {...props} className="text-ink-muted mt-5 leading-[1.75]" />,
  ul: (props) => (
    <ul {...props} className="text-ink-muted mt-5 space-y-3 pl-1" />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="text-ink-muted marker:text-brand mt-5 list-decimal space-y-3 pl-5 marker:font-bold"
    />
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="relative pl-6 leading-[1.7]">
      <span
        aria-hidden="true"
        className="bg-brand absolute top-[0.62em] left-0 h-1.5 w-1.5 rounded-full [ol_&]:hidden"
      />
      {children}
    </li>
  ),
  strong: (props) => <strong {...props} className="text-ink font-bold" />,
  em: (props) => <em {...props} className="text-ink-muted italic" />,
  a: ({ href = "", children, ...props }) => {
    const external = /^https?:/.test(href);
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand decoration-brand/30 hover:decoration-brand font-semibold underline underline-offset-4 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-brand decoration-brand/30 hover:decoration-brand font-semibold underline underline-offset-4 transition-colors"
      >
        {children}
      </Link>
    );
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="rounded-r-card border-brand bg-panel text-ink-muted mt-7 border-l-4 py-5 pr-6 pl-6 italic"
    />
  ),
  hr: () => <hr className="border-line mt-14" />,
  table: (props) => (
    <div className="md:rounded-card md:border-line -mx-6 mt-7 overflow-x-auto px-6 md:mx-0 md:overflow-hidden md:border md:px-0">
      <table
        {...props}
        className="w-full min-w-[32rem] border-collapse text-[0.9375rem]"
      />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-line bg-panel text-ink border-b px-4 py-3 text-left text-xs font-bold tracking-wide uppercase"
    />
  ),
  td: (props) => (
    <td {...props} className="border-line text-ink-muted border-b px-4 py-3" />
  ),
  code: (props) => (
    <code
      {...props}
      className="bg-brand-tint text-brand rounded px-1.5 py-0.5 font-mono text-[0.85em] font-semibold"
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="text-[1.0625rem]">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </div>
  );
}

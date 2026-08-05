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
      className="mt-14 scroll-mt-24 text-[1.75rem] leading-tight font-semibold tracking-[-0.025em] first:mt-0"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-10 scroll-mt-24 text-xl leading-snug font-semibold tracking-[-0.02em]"
    />
  ),
  p: (props) => <p {...props} className="text-fg-muted mt-5 leading-[1.75]" />,
  ul: (props) => (
    <ul {...props} className="text-fg-muted mt-5 space-y-2.5 pl-1" />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="text-fg-muted marker:text-accent mt-5 list-decimal space-y-2.5 pl-5 marker:font-semibold"
    />
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="marker:text-accent relative pl-5 leading-[1.7]">
      <span
        aria-hidden="true"
        className="bg-accent/70 absolute top-[0.7em] left-0 h-1.5 w-1.5 rounded-full [ol_&]:hidden"
      />
      {children}
    </li>
  ),
  strong: (props) => <strong {...props} className="text-fg font-semibold" />,
  em: (props) => <em {...props} className="text-fg-muted italic" />,
  a: ({ href = "", children, ...props }) => {
    const external = /^https?:/.test(href);
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent decoration-accent/30 hover:decoration-accent font-medium underline underline-offset-4 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-accent decoration-accent/30 hover:decoration-accent font-medium underline underline-offset-4 transition-colors"
      >
        {children}
      </Link>
    );
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-accent/50 text-fg-muted mt-6 border-l-2 pl-5 italic"
    />
  ),
  hr: () => <hr className="border-line mt-12" />,
  table: (props) => (
    <div className="-mx-5 mt-6 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table
        {...props}
        className="w-full min-w-[32rem] border-collapse text-sm"
      />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-line-strong font-display text-fg-subtle border-b px-3 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
    />
  ),
  td: (props) => (
    <td {...props} className="border-line text-fg-muted border-b px-3 py-2.5" />
  ),
  code: (props) => (
    <code
      {...props}
      className="text-accent rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]"
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

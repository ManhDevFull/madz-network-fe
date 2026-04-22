import { SectionCard } from "@/components/ui/section-card";

const posts = [
  {
    author: "Madz Studio",
    time: "2m",
    content:
      "Dark UI is not just a palette choice. It is a pacing system. Your content has to feel like it is glowing out of the canvas.",
  },
  {
    author: "Backend Watch",
    time: "9m",
    content:
      "Auth endpoints are ready for login/register. Once CORS is enabled, the browser can hit the Nest service directly.",
  },
  {
    author: "Product Notes",
    time: "14m",
    content:
      "Keep the MVP strict: home for framing, auth for conversion, shared folder layout for maintainability.",
  },
];

export function FeedPreview() {
  return (
    <SectionCard eyebrow="Home Feed" title="A starter surface for the product">
      <div className="grid gap-3">
        {posts.map((post) => (
          <article
            key={`${post.author}-${post.time}`}
            className="rounded-[24px] border border-white/8 bg-white/[0.035] px-4 py-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-foreground">
                  {post.author
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {post.author}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {post.time}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                Live
              </span>
            </div>
            <p className="text-sm leading-6 text-silver">{post.content}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

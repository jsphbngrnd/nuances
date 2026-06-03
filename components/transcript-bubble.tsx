import { cn, getInitials } from "@/lib/utils";
import type { TranscriptMessage } from "@/lib/types";

export function TranscriptBubble({ message, isOwn }: { message: TranscriptMessage; isOwn?: boolean }) {
  if (message.sourceType === "system") {
    return (
      <div className="mx-auto max-w-[92%] rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-center text-sm leading-6 text-ink/72">
        {message.content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-3",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {!isOwn ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs uppercase tracking-[0.2em] text-ink/72">
          {getInitials(message.speaker)}
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[82%] rounded-[26px] px-4 py-3",
          isOwn
            ? "rounded-br-md bg-bone text-fog"
            : "rounded-bl-md border border-white/10 bg-white/6 text-ink"
        )}
      >
        <div className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] opacity-65">
          <span>{message.speaker}</span>
          <span>{message.sourceType === "text" ? "Typed" : "Live transcript"}</span>
        </div>
        <p className="text-sm leading-6">{message.content}</p>
      </div>
    </div>
  );
}

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-4" role="status" aria-label="Assistant is thinking">
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white">
        <svg viewBox="0 0 100 100" fill="currentColor" className="h-4 w-4"><path d="M50 0 60.7 35.2 91 18 73.8 48.3 100 50 73.8 60.7 91 91 60.7 73.8 50 100 39.3 73.8 9 91 26.2 60.7 0 50 26.2 39.3 9 9 39.3 26.2Z" /></svg>
      </span>
      <span className="flex h-10 items-center gap-1.5 border-2 border-[#111827] bg-white px-4 shadow-[2px_2px_0_#111827]">
        <span className="h-1.5 w-1.5 animate-bounce bg-[#2563EB] [animation-delay:-0.24s]" />
        <span className="h-1.5 w-1.5 animate-bounce bg-[#2563EB] [animation-delay:-0.12s]" />
        <span className="h-1.5 w-1.5 animate-bounce bg-[#2563EB]" />
        <span className="sr-only">Assistant is thinking</span>
      </span>
    </div>
  );
}

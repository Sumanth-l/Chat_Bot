interface EmptyStateProps {
  onPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const prompts = [
  { label: 'Make sense of a big idea', prompt: 'Explain a complex idea I have in simple, practical terms.' },
  { label: 'Write a first draft', prompt: 'Help me write a clear first draft for a project proposal.' },
  { label: 'Unblock my next step', prompt: 'Help me break down a challenging task into a few clear next steps.' },
];

function Burst({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 100 100" fill="currentColor" className={className}><path d="M50 0 60.7 35.2 91 18 73.8 48.3 100 50 73.8 60.7 91 91 60.7 73.8 50 100 39.3 73.8 9 91 26.2 60.7 0 50 26.2 39.3 9 9 39.3 26.2Z" /></svg>;
}

export default function EmptyState({ onPrompt, disabled = false }: EmptyStateProps) {
  return (
    <section className="relative mx-auto flex w-full max-w-[850px] flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-14" aria-labelledby="empty-title">
      <div aria-hidden="true" className="pointer-events-none absolute right-[7%] top-[14%] hidden h-16 w-16 rotate-12 border-2 border-[#111827] bg-[#2563EB] shadow-[5px_5px_0_#111827] sm:block" />
      <Burst className="pointer-events-none absolute bottom-[20%] right-[12%] hidden h-16 w-16 -rotate-6 text-[#2563EB] sm:block" />
      <div className="mb-7 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white shadow-[3px_3px_0_#111827]">
          <Burst className="h-6 w-6" />
        </span>
        <span className="border-2 border-[#111827] bg-white px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.17em] shadow-[2px_2px_0_#111827]">Ready when you are</span>
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#2563EB]">A good question changes everything</p>
      <h2 id="empty-title" className="mt-3 max-w-[650px] text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.08em]">Make your next move<span className="text-[#2563EB]">.</span></h2>
      <p className="mt-5 max-w-[480px] text-sm leading-7 text-slate-600 sm:text-base">Start with a thought, a challenge, or a half-formed idea. We’ll work it out together.</p>
      <div className="mt-9 grid max-w-[710px] gap-3 sm:grid-cols-3">
        {prompts.map(({ label, prompt }, index) => (
          <button key={label} type="button" disabled={disabled} onClick={() => onPrompt(prompt)} className="group min-h-[110px] border-2 border-[#111827] bg-white p-4 text-left shadow-[3px_3px_0_#111827] transition-[transform,box-shadow,background-color] hover:-translate-y-1 hover:bg-blue-50 hover:shadow-[5px_5px_0_#111827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50">
            <span className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400"><span>0{index + 1}</span><span className="text-base text-[#2563EB] transition-transform group-hover:translate-x-1">↗</span></span>
            <span className="mt-5 block text-sm font-extrabold leading-5 tracking-[-0.02em]">{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-[10px] font-semibold text-slate-400">Dialog can make mistakes. Check important details.</p>
    </section>
  );
}

import type { ChatUser } from '../../types/chat';

interface ChatHeaderProps {
  title: string;
  user: ChatUser;
  onOpenSidebar: () => void;
}

export default function ChatHeader({ title, user, onOpenSidebar }: ChatHeaderProps) {
  const initial = (user.name || user.email || 'U').trim()[0]?.toUpperCase() || 'U';
  return (
    <header className="flex min-h-[76px] items-center gap-3 border-b-2 border-[#111827] bg-white/95 px-4 backdrop-blur-sm sm:px-7">
      <button type="button" onClick={onOpenSidebar} aria-label="Open conversations" className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[#111827] bg-white text-xl transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] lg:hidden">☰</button>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Your workspace / Chat</p>
        <h1 className="mt-1 truncate text-lg font-black tracking-[-0.05em] sm:text-xl">{title}</h1>
      </div>
      <span title={user.name || user.email || 'User profile'} className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[#111827] bg-[#2563EB] text-xs font-black text-white">{initial}</span>
    </header>
  );
}

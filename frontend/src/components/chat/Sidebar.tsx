import type { ChatUser, Conversation } from '../../types/chat';
import ConversationList from './ConversationList';

interface SidebarProps {
  user: ChatUser;
  conversations: Conversation[];
  activeConversationId: string | null;
  loadingConversations: boolean;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, conversations, activeConversationId, loadingConversations, onSelectConversation, onDeleteConversation, onNewChat, onLogout, isLoggingOut, onClose }: SidebarProps) {
  const displayName = user.name || user.email?.split('@')[0] || 'Workspace member';
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';

  return (
    <aside className="flex h-full min-h-0 w-[288px] shrink-0 flex-col border-r-2 border-slate-700 bg-[#0F172A] text-white" aria-label="Conversations sidebar">
      <div className="flex items-center justify-between border-b-2 border-slate-700 px-5 py-5">
        <a href="/" className="inline-flex items-center gap-2.5 font-black tracking-[-0.06em]" aria-label="Dialog home">
          <span className="grid h-8 w-8 place-items-center border-2 border-white bg-[#2563EB] text-white">
            <svg aria-hidden="true" viewBox="0 0 100 100" fill="currentColor" className="h-[18px] w-[18px]"><path d="M50 0 60.7 35.2 91 18 73.8 48.3 100 50 73.8 60.7 91 91 60.7 73.8 50 100 39.3 73.8 9 91 26.2 60.7 0 50 26.2 39.3 9 9 39.3 26.2Z" /></svg>
          </span>
          <span className="text-xl">dialog<span className="text-blue-400">.</span></span>
        </a>
        {onClose && <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-9 w-9 place-items-center border-2 border-slate-600 text-slate-300 transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"><span aria-hidden="true" className="text-xl leading-none">×</span></button>}
      </div>

      <div className="px-4 pt-5">
        <button type="button" onClick={onNewChat} className="group flex min-h-12 w-full items-center gap-2.5 border-2 border-white bg-[#2563EB] px-3.5 text-left text-sm font-extrabold text-white shadow-[3px_3px_0_#fff] transition-[transform,background-color,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-700 hover:shadow-[1px_1px_0_#fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center border-2 border-white text-lg leading-none transition-transform group-hover:rotate-90">+</span>
          New chat
        </button>
      </div>

      <div className="mt-8 flex min-h-0 flex-1 flex-col px-3">
        <div className="flex items-center justify-between px-2 pb-3">
          <h2 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Recent chats</h2>
          <span className="border border-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">{conversations.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-4 pr-1">
          <ConversationList conversations={conversations} activeConversationId={activeConversationId} onSelect={onSelectConversation} onDelete={onDeleteConversation} loading={loadingConversations} />
        </div>
      </div>

      <div className="border-t-2 border-slate-700 p-4">
        <div className="flex items-center gap-3 border-2 border-slate-700 bg-slate-900/70 px-3 py-3">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center border-2 border-white bg-[#2563EB] text-xs font-black text-white">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-extrabold">{displayName}</span>
            <span className="mt-1 block truncate text-[10px] text-slate-500">{user.email || 'Personal workspace'}</span>
          </span>
          <span title="Signed in" className="h-2 w-2 shrink-0 bg-emerald-400" />
        </div>
        <button type="button" onClick={onLogout} disabled={isLoggingOut} className="mt-3 flex min-h-10 w-full items-center gap-2 border-2 border-slate-700 px-3 text-left text-xs font-extrabold text-slate-300 transition-colors hover:border-red-400 hover:bg-red-950/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M8 4H4v12h4m3-3 3-3-3-3m3 3H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" /></svg>
          {isLoggingOut ? 'Signing out…' : 'Sign out'}
        </button>
        <p className="mt-3 px-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">A clearer way forward <span className="text-blue-400">↗</span></p>
      </div>
    </aside>
  );
}

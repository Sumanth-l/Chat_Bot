import type { Conversation } from '../../types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ConversationItem({ conversation, active, onSelect, onDelete }: ConversationItemProps) {
  return (
    <div className={`group flex items-stretch border-2 transition-colors duration-150 ${active ? 'border-white bg-white text-[#0F172A]' : 'border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white'}`}>
      <button type="button" onClick={() => onSelect(conversation.id)} aria-current={active ? 'page' : undefined} title={conversation.title} className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white">
        <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center border-2 ${active ? 'border-[#111827] bg-[#2563EB] text-white' : 'border-slate-500 bg-slate-900 text-blue-300 group-hover:border-blue-300'}`}>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M4 5.5h12v8H9l-3.5 2v-2H4v-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" /></svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold">{conversation.title}</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(conversation.updatedAt || conversation.createdAt))}
          </span>
        </span>
        <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${active ? 'bg-[#2563EB]' : 'bg-transparent group-hover:bg-blue-400'}`} />
      </button>
      <button type="button" onClick={() => onDelete(conversation.id)} aria-label={`Delete ${conversation.title}`} title="Delete conversation" className="grid w-9 shrink-0 place-items-center text-slate-500 opacity-100 transition-colors hover:text-red-400 focus-visible:outline-2 focus-visible:outline-white sm:opacity-0 sm:group-hover:opacity-100">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M4 6h12M8 6V4h4v2m3 0-.7 10H5.7L5 6m3 3v4m4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" /></svg>
      </button>
    </div>
  );
}

import type { Feedback, FeedbackFormType, FeedbackType, Message } from '../../types/chat';
import FormattedMessage from './FormattedMessage';

interface MessageBubbleProps {
  message: Message;
  userName?: string;
  feedback: Feedback[];
  isFeedbackSubmitting: boolean;
  onDelete: (id: string) => void;
  onInspect: (id: string) => void;
  onReact: (messageId: string, type: 'LIKE' | 'DISLIKE') => void;
  onOpenFeedback: (messageId: string, type: FeedbackFormType) => void;
}

export default function MessageBubble({ message, userName, feedback, isFeedbackSubmitting, onDelete, onInspect, onReact, onOpenFeedback }: MessageBubbleProps) {
  const isUser = message.role === 'USER';
  const hasFeedback = (type: FeedbackType) => feedback.some((item) => item.type === type);
  const actionClass = 'inline-flex min-h-8 items-center gap-1 border-2 px-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-wait disabled:opacity-50';

  return (
    <article className={`message-enter flex gap-3 py-4 sm:gap-4 sm:py-5 ${isUser ? 'justify-end' : 'justify-start'}`} aria-label={`${isUser ? userName || 'You' : 'Assistant'} said`}>
      {!isUser && <span aria-hidden="true" className="mt-1 grid h-9 w-9 shrink-0 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white">
        <svg viewBox="0 0 100 100" fill="currentColor" className="h-4 w-4"><path d="M50 0 60.7 35.2 91 18 73.8 48.3 100 50 73.8 60.7 91 91 60.7 73.8 50 100 39.3 73.8 9 91 26.2 60.7 0 50 26.2 39.3 9 9 39.3 26.2Z" /></svg>
      </span>}
      <div className={`min-w-0 max-w-[88%] sm:max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <p className={`mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.17em] ${isUser ? 'text-slate-400' : 'text-slate-500'}`}>
          {isUser ? 'You' : 'Dialog AI'} <span className="ml-1 font-medium tracking-normal">Â· {new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(message.createdAt))}</span>
        </p>
        <div className={`break-words border-2 px-4 py-3.5 text-left text-[14px] leading-7 sm:px-5 sm:py-4 sm:text-[15px] ${isUser ? 'whitespace-pre-wrap border-[#111827] bg-[#2563EB] font-medium text-white shadow-[3px_3px_0_#111827]' : 'border-[#111827] bg-white text-[#111827] shadow-[3px_3px_0_#111827]'}`}>
          {isUser ? message.content : <FormattedMessage content={message.content} />}
        </div>
        {!message.id.startsWith('pending-') && <div className={`mt-2 flex flex-wrap items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && <>
            <button type="button" onClick={() => onReact(message.id, 'LIKE')} disabled={isFeedbackSubmitting} aria-label="Like this response" aria-pressed={hasFeedback('LIKE')} title="Like" className={`${actionClass} ${hasFeedback('LIKE') ? 'border-[#2563EB] bg-blue-50 text-[#1D4ED8]' : 'border-slate-300 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#1D4ED8]'}`}><span aria-hidden="true">👍</span><span>Like</span></button>
            <button type="button" onClick={() => onReact(message.id, 'DISLIKE')} disabled={isFeedbackSubmitting} aria-label="Dislike this response" aria-pressed={hasFeedback('DISLIKE')} title="Dislike" className={`${actionClass} ${hasFeedback('DISLIKE') ? 'border-[#2563EB] bg-blue-50 text-[#1D4ED8]' : 'border-slate-300 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#1D4ED8]'}`}><span aria-hidden="true">👎</span><span>Dislike</span></button>
            <button type="button" onClick={() => onOpenFeedback(message.id, 'GENERAL')} disabled={isFeedbackSubmitting} aria-label="Rate this response" aria-pressed={hasFeedback('GENERAL')} title="Rate response" className={`${actionClass} ${hasFeedback('GENERAL') ? 'border-[#2563EB] bg-blue-50 text-[#1D4ED8]' : 'border-slate-300 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#1D4ED8]'}`}><span aria-hidden="true">⭐</span><span>Rate</span>{hasFeedback('GENERAL') && <span className="tabular-nums">{feedback.find((item) => item.type === 'GENERAL')?.rating}/5</span>}</button>
            <button type="button" onClick={() => onOpenFeedback(message.id, 'BUG_REPORT')} disabled={isFeedbackSubmitting} aria-label="Report an issue with this response" title="Report issue" className={`${actionClass} border-slate-300 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#1D4ED8]`}><span aria-hidden="true">🚩</span><span>Report</span></button>
            <button type="button" onClick={() => onOpenFeedback(message.id, 'FEATURE_REQUEST')} disabled={isFeedbackSubmitting} aria-label="Suggest a feature" title="Feature request" className={`${actionClass} border-slate-300 bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#1D4ED8]`}><span aria-hidden="true">💡</span><span>Feature</span></button>
          </>}
          <button type="button" onClick={() => onInspect(message.id)} className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 underline decoration-transparent underline-offset-2 transition hover:text-[#2563EB] hover:decoration-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">Details</button>
          <button type="button" onClick={() => onDelete(message.id)} className="px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 underline decoration-transparent underline-offset-2 transition hover:text-red-700 hover:decoration-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">Delete</button>
        </div>}
      </div>
      {isUser && <span aria-hidden="true" title={userName || 'You'} className="mt-1 grid h-9 w-9 shrink-0 place-items-center border-2 border-[#111827] bg-slate-200 text-xs font-black text-[#111827]">{(userName || 'U').trim()[0]?.toUpperCase()}</span>}
    </article>
  );
}

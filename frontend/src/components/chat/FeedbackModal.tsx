import { useState, type FormEvent } from 'react';
import type { FeedbackFormType } from '../../types/chat';

interface FeedbackModalProps {
  type: FeedbackFormType;
  isSubmitting: boolean;
  initialRating?: number;
  initialComment?: string;
  onClose: () => void;
  onSubmit: (input: { rating?: number; comment?: string }) => Promise<void>;
}

const modalContent: Record<FeedbackFormType, { eyebrow: string; title: string; description: string; submit: string }> = {
  GENERAL: {
    eyebrow: 'Rate this response',
    title: 'How did we do?',
    description: 'Your rating helps us improve the assistant.',
    submit: 'Submit rating',
  },
  BUG_REPORT: {
    eyebrow: 'Report an issue',
    title: 'Something went wrong?',
    description: 'Tell us what happened so we can investigate.',
    submit: 'Send report',
  },
  FEATURE_REQUEST: {
    eyebrow: 'Feature request',
    title: 'What would help you?',
    description: 'Share an idea that would make this assistant more useful.',
    submit: 'Send idea',
  },
};

export default function FeedbackModal({ type, isSubmitting, initialRating = 0, initialComment = '', onClose, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const content = modalContent[type];
  const commentRequired = type !== 'GENERAL';
  const canSubmit = !isSubmitting && (type !== 'GENERAL' || rating > 0) && (!commentRequired || Boolean(comment.trim()));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      ...(type === 'GENERAL' ? { rating } : {}),
      ...(comment.trim() ? { comment: comment.trim() } : {}),
    });
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#0F172A]/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title" className="relative w-full max-w-lg border-2 border-[#111827] bg-white p-6 shadow-[7px_7px_0_#2563EB] sm:p-8">
        <div aria-hidden="true" className="absolute -right-2 -top-2 h-5 w-5 border-2 border-[#111827] bg-[#2563EB]" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#2563EB]">{content.eyebrow}</p>
            <h2 id="feedback-modal-title" className="mt-2 text-3xl font-black tracking-[-0.06em]">{content.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{content.description}</p>
          </div>
          <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close feedback dialog" className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[#111827] text-xl transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50">×</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          {type === 'GENERAL' && <fieldset>
            <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em]">Your rating</legend>
            <div className="flex gap-2" role="group" aria-label="Rate from 1 to 5 stars">
              {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} aria-pressed={rating === value} className={`text-3xl leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${rating >= value ? 'text-[#2563EB]' : 'text-slate-300 hover:text-blue-300'}`}>★</button>)}
            </div>
          </fieldset>}

          <label htmlFor="feedback-comment" className="mb-2 mt-5 block text-xs font-extrabold uppercase tracking-[0.12em]">
            {type === 'GENERAL' ? 'Additional comments (optional)' : 'Details'}
          </label>
          <textarea id="feedback-comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={2000} required={commentRequired} rows={5} placeholder={type === 'BUG_REPORT' ? 'Describe what happened and what you expected…' : type === 'FEATURE_REQUEST' ? 'Describe the feature and how you would use it…' : 'Share anything else about this response…'} className="w-full resize-y border-2 border-[#111827] bg-[#F8FAFC] px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
          <p className="mt-1 text-right text-[10px] font-semibold text-slate-400">{comment.length} / 2,000</p>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="h-11 border-2 border-[#111827] bg-white px-4 text-xs font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-slate-100 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={!canSubmit} className="h-11 border-2 border-[#111827] bg-[#2563EB] px-5 text-xs font-extrabold uppercase tracking-[0.08em] text-white shadow-[3px_3px_0_#111827] transition-[transform,background-color,box-shadow] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-blue-700 hover:shadow-[2px_2px_0_#111827] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Sending…' : content.submit}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

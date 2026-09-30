import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [value]);

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const content = value.trim();
    if (!content || disabled) return;
    onSend(content);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="shrink-0 border-t-2 border-[#111827] bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-sm sm:px-7 sm:pt-5">
      <form onSubmit={submit} className="mx-auto max-w-[850px]">
        <label htmlFor="chat-message" className="sr-only">Write a message</label>
        <div className="flex items-end gap-2 border-2 border-[#111827] bg-[#F8FAFC] p-2 transition-[border-color,box-shadow] focus-within:border-[#2563EB] focus-within:shadow-[3px_3px_0_#2563EB] sm:gap-3 sm:p-2.5">
          <textarea
            ref={textareaRef}
            id="chat-message"
            name="message"
            rows={1}
            maxLength={10000}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything. Start anywhere…"
            disabled={disabled}
            className="max-h-[180px] min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-[#111827] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
          />
          <button type="submit" disabled={disabled || !value.trim()} className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white shadow-[2px_2px_0_#111827] transition-[transform,background-color,box-shadow] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-blue-700 hover:shadow-[1px_1px_0_#111827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
            <span className="sr-only">Send message</span>
            {disabled ? <span aria-hidden="true" className="h-4 w-4 animate-spin border-2 border-white/50 border-t-white" /> : <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5"><path d="M3 10h13M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" /></svg>}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[9px] font-semibold text-slate-400 sm:text-[10px]">
          <span>Enter to send <span className="px-1 text-slate-300">·</span> Shift + Enter for a new line</span>
          <span>{value.length.toLocaleString()} / 10,000</span>
        </div>
      </form>
    </div>
  );
}

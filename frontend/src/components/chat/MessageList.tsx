import { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  userName?: string;
  isLoadingMessages: boolean;
  isSending: boolean;
  onDeleteMessage: (id: string) => void;
  onInspectMessage: (id: string) => void;
}

export default function MessageList({ messages, userName, isLoadingMessages, isSending, onDeleteMessage, onInspectMessage }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, isSending]);

  if (isLoadingMessages) return <div className="grid flex-1 place-items-center" role="status"><span className="h-7 w-7 animate-spin border-[3px] border-slate-200 border-t-[#2563EB]" /><span className="sr-only">Loading messages</span></div>;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-7" aria-label="Conversation messages" aria-live="polite">
      <div className="mx-auto max-w-[850px] divide-y divide-slate-200/70 pb-5 pt-3">
        {messages.map((message) => <MessageBubble key={message.id} message={message} userName={userName} onDelete={onDeleteMessage} onInspect={onInspectMessage} />)}
        {isSending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

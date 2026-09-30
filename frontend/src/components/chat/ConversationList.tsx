import type { Conversation } from '../../types/chat';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function ConversationList({ conversations, activeConversationId, onSelect, onDelete, loading }: ConversationListProps) {
  if (loading) return <p className="px-3 py-4 text-xs font-semibold text-slate-500" role="status">Loading conversations…</p>;
  if (!conversations.length) return <p className="px-3 py-4 text-xs leading-5 text-slate-500">Your conversations will show up here. Start a new one whenever you’re ready.</p>;

  return (
    <ul className="space-y-1.5" aria-label="Your conversations">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <ConversationItem conversation={conversation} active={conversation.id === activeConversationId} onSelect={onSelect} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

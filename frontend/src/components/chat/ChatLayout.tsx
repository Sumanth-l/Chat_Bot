import { useCallback, useEffect, useState } from 'react';
import { chatApi } from '../../services/chatApi';
import { SessionExpiredError } from '../../services/apiClient';
import { authApi } from '../../services/authApi';
import type { ChatUser, Conversation, Feedback, FeedbackFormType, FeedbackType, Message } from '../../types/chat';
import { feedbackApi } from '../../services/feedbackApi';
import ChatHeader from './ChatHeader';
import FeedbackModal from './FeedbackModal';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import Sidebar from './Sidebar';

interface ChatLayoutProps {
  user: ChatUser;
  onSessionExpired: () => void;
  onLogout: () => void;
}

function titleFromMessage(content: string) {
  const title = content.trim().replace(/\s+/g, ' ');
  return title.length > 48 ? `${title.slice(0, 45).trimEnd()}…` : title;
}

export default function ChatLayout({ user, onSessionExpired, onLogout }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackModal, setFeedbackModal] = useState<{ messageId: string; type: FeedbackFormType } | null>(null);
  const [feedbackSubmittingMessageId, setFeedbackSubmittingMessageId] = useState<string | null>(null);
  const [messageDetails, setMessageDetails] = useState<Message | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      setConversations(await chatApi.getConversations());
    } catch (loadError) {
      if (loadError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(loadError instanceof Error ? loadError.message : 'Could not load conversations.');
    } finally {
      setIsLoadingConversations(false);
    }
  }, [onSessionExpired]);

  useEffect(() => { void loadConversations(); }, [loadConversations]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      setFeedback([]);
      setIsLoadingMessages(false);
      return;
    }

    const conversationId = activeConversationId;
    let current = true;
    setMessages([]);
    setFeedback([]);
    setIsLoadingMessages(true);
    void chatApi.getMessages(conversationId).then((loadedMessages) => {
      if (current) setMessages(loadedMessages);
    }).catch((loadError: unknown) => {
      if (!current) return;
      if (loadError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(loadError instanceof Error ? loadError.message : 'Could not load this conversation.');
    }).finally(() => {
      if (current) setIsLoadingMessages(false);
    });

    void feedbackApi.getConversationFeedback(conversationId).then((loadedFeedback) => {
      if (current) setFeedback(loadedFeedback);
    }).catch((loadError: unknown) => {
      if (!current) return;
      if (loadError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(loadError instanceof Error ? loadError.message : 'Could not load feedback for this conversation.');
    });

    return () => { current = false; };
  }, [activeConversationId, onSessionExpired]);

  function startNewChat() {
    if (isSending) return;
    setActiveConversationId(null);
    setMessages([]);
    setFeedback([]);
    setFeedbackModal(null);
    setError('');
    setSidebarOpen(false);
  }

  async function sendMessage(content: string) {
    if (isSending) return;
    setError('');
    setIsSending(true);
    const pendingId = `pending-${crypto.randomUUID()}`;
    const pendingMessage: Message = {
      id: pendingId,
      conversationId: activeConversationId || '',
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, pendingMessage]);
    let conversationId = activeConversationId;

    try {
      if (!conversationId) {
        const conversation = await chatApi.createConversation(titleFromMessage(content));
        conversationId = conversation.id;
        setConversations((current) => [conversation, ...current.filter((item) => item.id !== conversation.id)]);
      }

      const result = await chatApi.sendMessage(conversationId, content);
      setActiveConversationId(conversationId);
      setMessages(await chatApi.getMessages(result.conversationId));
      void loadConversations();
    } catch (sendError) {
      if (sendError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(sendError instanceof Error ? sendError.message : 'Could not send your message. Please try again.');
      if (conversationId) {
        setActiveConversationId(conversationId);
        try { setMessages(await chatApi.getMessages(conversationId)); } catch { /* Keep the original send error visible. */ }
      } else {
        setMessages((current) => current.filter((message) => message.id !== pendingId));
      }
    } finally {
      setIsSending(false);
    }
  }

  async function deleteConversation(conversationId: string) {
    if (isSending || !window.confirm('Delete this conversation and its messages? This cannot be undone.')) return;
    setError('');
    try {
      await chatApi.deleteConversation(conversationId);
      setConversations((current) => current.filter((conversation) => conversation.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
        setFeedback([]);
        setFeedbackModal(null);
      }
    } catch (deleteError) {
      if (deleteError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this conversation.');
    }
  }

  async function deleteMessage(messageId: string) {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      await chatApi.deleteMessage(messageId);
      setMessages((current) => current.filter((message) => message.id !== messageId));
      setFeedback((current) => current.filter((item) => item.messageId !== messageId));
    } catch (deleteError) {
      if (deleteError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete this message.');
    }
  }

  async function inspectMessage(messageId: string) {
    try {
      setMessageDetails(await chatApi.getMessage(messageId));
    } catch (inspectError) {
      if (inspectError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(inspectError instanceof Error ? inspectError.message : 'Could not load message details.');
    }
  }

  async function submitFeedback(messageId: string, type: FeedbackType, details: { rating?: number; comment?: string } = {}) {
    if (!activeConversationId || feedbackSubmittingMessageId) return;
    setFeedbackSubmittingMessageId(messageId);
    setError('');
    try {
      const savedFeedback = await feedbackApi.submit({
        conversationId: activeConversationId,
        messageId,
        type,
        ...details,
      });
      setFeedback((current) => [
        ...current.filter((item) => item.messageId !== messageId || (item.type !== type && !((type === 'LIKE' || type === 'DISLIKE') && (item.type === 'LIKE' || item.type === 'DISLIKE')))),
        savedFeedback,
      ]);
      setFeedbackModal(null);
    } catch (feedbackError) {
      if (feedbackError instanceof SessionExpiredError) {
        onSessionExpired();
        return;
      }
      setError(feedbackError instanceof Error ? feedbackError.message : 'Could not save feedback. Please try again.');
    } finally {
      setFeedbackSubmittingMessageId(null);
    }
  }

  function openFeedback(messageId: string, type: FeedbackFormType) {
    setFeedbackModal({ messageId, type });
  }

  async function logout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setError('');
    try {
      await authApi.logout();
      onLogout();
    } catch (logoutError) {
      if (logoutError instanceof SessionExpiredError) {
        onLogout();
        return;
      }
      setError(logoutError instanceof Error ? logoutError.message : 'Could not sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  function selectConversation(id: string) {
    if (isSending) return;
    setError('');
    setActiveConversationId(id);
    setFeedbackModal(null);
    setSidebarOpen(false);
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);
  return (
    <main className="relative flex h-[100dvh] min-h-[520px] overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[length:36px_36px]" />

      <div className="relative z-10 hidden h-full lg:block">
        <Sidebar user={user} conversations={conversations} activeConversationId={activeConversationId} loadingConversations={isLoadingConversations} onSelectConversation={selectConversation} onDeleteConversation={deleteConversation} onNewChat={startNewChat} onLogout={logout} isLoggingOut={isLoggingOut} />
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 flex lg:hidden">
        <button type="button" aria-label="Close conversations menu" onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-[#0F172A]/70" />
        <div className="relative z-10 h-full"><Sidebar user={user} conversations={conversations} activeConversationId={activeConversationId} loadingConversations={isLoadingConversations} onSelectConversation={selectConversation} onDeleteConversation={deleteConversation} onNewChat={startNewChat} onLogout={logout} isLoggingOut={isLoggingOut} onClose={() => setSidebarOpen(false)} /></div>
      </div>}

      <section className="relative z-0 flex min-w-0 flex-1 flex-col" aria-label="Chat workspace">
        <ChatHeader title={activeConversation?.title || 'New conversation'} user={user} onOpenSidebar={() => setSidebarOpen(true)} />
        {error && <div role="alert" className="mx-4 mt-4 flex items-start justify-between gap-4 border-2 border-red-800 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800 sm:mx-7">
          <span>{error}</span>
          <button type="button" aria-label="Dismiss error" onClick={() => setError('')} className="shrink-0 text-lg leading-5">×</button>
        </div>}

        {(activeConversationId || messages.length > 0)
          ? <MessageList messages={messages} feedback={feedback} userName={user.name} isLoadingMessages={isLoadingMessages} isSending={isSending} feedbackSubmittingMessageId={feedbackSubmittingMessageId} onReact={(messageId, type) => { void submitFeedback(messageId, type); }} onOpenFeedback={openFeedback} onDeleteMessage={deleteMessage} onInspectMessage={inspectMessage} />
          : <div className="min-h-0 flex-1" aria-hidden="true" />}
        <MessageInput onSend={(content) => { void sendMessage(content); }} disabled={isSending} />
      </section>
      {messageDetails && <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMessageDetails(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="message-detail-title" className="w-full max-w-lg border-2 border-[#111827] bg-white p-6 shadow-[7px_7px_0_#2563EB] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#2563EB]">Stored message</p><h2 id="message-detail-title" className="mt-1 text-2xl font-black tracking-[-0.05em]">Message details</h2></div>
            <button type="button" onClick={() => setMessageDetails(null)} aria-label="Close message details" className="grid h-9 w-9 place-items-center border-2 border-[#111827] text-xl hover:bg-slate-100">×</button>
          </div>
          <p className="mt-5 border-2 border-[#111827] bg-[#F8FAFC] p-4 text-sm leading-6">{messageDetails.content}</p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
            <dt className="font-extrabold uppercase tracking-wider text-slate-500">Role</dt><dd className="font-bold">{messageDetails.role}</dd>
            <dt className="font-extrabold uppercase tracking-wider text-slate-500">Created</dt><dd className="font-medium">{new Date(messageDetails.createdAt).toLocaleString()}</dd>
            <dt className="font-extrabold uppercase tracking-wider text-slate-500">ID</dt><dd className="break-all font-mono text-[10px]">{messageDetails.id}</dd>
          </dl>
        </section>
      </div>}
      {feedbackModal && <FeedbackModal type={feedbackModal.type} isSubmitting={feedbackSubmittingMessageId === feedbackModal.messageId} initialRating={feedback.find((item) => item.messageId === feedbackModal.messageId && item.type === feedbackModal.type)?.rating ?? undefined} initialComment={feedback.find((item) => item.messageId === feedbackModal.messageId && item.type === feedbackModal.type)?.comment ?? ''} onClose={() => setFeedbackModal(null)} onSubmit={(details) => submitFeedback(feedbackModal.messageId, feedbackModal.type, details)} />}
    </main>
  );
}

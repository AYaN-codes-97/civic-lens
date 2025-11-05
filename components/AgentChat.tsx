// Fix: Implement the AgentChat component to provide an interactive AI chat interface.
import React, { useState, useRef, useEffect } from 'react';
import type { Issue, ChatMessage } from '../types';
import { PaperAirplaneIcon } from './Icons';
import { getAIResponseForIssue, draftEmailToOfficial } from '../services/geminiService';
import { EmailPreviewModal } from './EmailPreviewModal';

interface AgentChatProps {
    issue: Issue;
}

interface EmailData {
    to: string;
    subject: string;
    body: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({ issue }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'agent', text: `Hi! I'm a helpful AI agent. How can I assist you with the issue: "${issue.title}"?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailData, setEmailData] = useState<EmailData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (messageText?: string) => {
        const text = (messageText || input).trim();
        if (!text || isLoading) return;

        const newUserMessage: ChatMessage = { sender: 'user', text };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponse = await getAIResponseForIssue(issue, messages, text);

        setMessages(prev => [...prev, { sender: 'agent', text: aiResponse }]);
        setIsLoading(false);
    };
    
    const handleDraftEmail = async () => {
        setIsLoading(true);
        const userMessage: ChatMessage = { sender: 'user', text: 'Please draft an email to a city official about this.' };
        setMessages(prev => [...prev, userMessage]);
        
        const agentThinkingMessage: ChatMessage = { sender: 'agent', text: 'Sure, I can do that. Drafting an email now...' };
        setMessages(prev => [...prev, agentThinkingMessage]);

        const data = await draftEmailToOfficial(issue);
        setEmailData(data);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-80 bg-gray-900 rounded-lg p-3">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 bg-gray-700 text-gray-200">
                             <div className="flex items-center justify-center space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast [animation-delay:0.4s]"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-2 flex-shrink-0">
                 <div className="flex gap-2 mb-2">
                    <button onClick={() => handleSend('Can you summarize this issue?')} disabled={isLoading} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition">Summarize</button>
                    <button onClick={handleDraftEmail} disabled={isLoading} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition">Draft email to official</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about the issue..."
                        disabled={isLoading}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
            {emailData && (
                <EmailPreviewModal
                    emailData={emailData}
                    onClose={() => setEmailData(null)}
                />
            )}
        </div>
    );
}

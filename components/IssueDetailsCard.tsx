import React from 'react';
import { XMarkIcon, ArrowUpCircleIcon } from './Icons';
import type { Issue } from '../types';
import { AgentChat } from './AgentChat';
import { CommentThread } from './CommentThread';

interface IssueDetailsCardProps {
    issue: Issue;
    onClose: () => void;
    onVote: (issueId: string) => void;
    hasVoted: boolean;
    isWin95Theme?: boolean;
}

export const IssueDetailsCard: React.FC<IssueDetailsCardProps> = ({ issue, onClose, onVote, hasVoted, isWin95Theme = false }) => {
    if (isWin95Theme) {
        return (
            <div className="absolute bottom-0 left-0 right-0 z-30 p-4 animate-slide-up">
                <div className="win95-window w-full max-w-4xl mx-auto max-h-[75vh] flex flex-col">
                    <div className="win95-titlebar">
                        <div className="win95-titlebar-text">{issue.title}</div>
                        <div className="win95-control-btns">
                            <button onClick={onClose} className="win95-control-btn">×</button>
                        </div>
                    </div>
                    <div className="p-4 overflow-y-auto" style={{ background: '#c0c0c0' }}>
                        <div className="mb-3">
                            <p className="text-xs mb-2"><strong>Category:</strong> {issue.category}</p>
                            <p className="text-xs mb-3">{issue.description}</p>
                            <div className="flex items-center gap-4 mb-3">
                                <button 
                                    onClick={() => onVote(issue.id)} 
                                    disabled={hasVoted}
                                    className="win95-btn text-xs"
                                >
                                    ▲ {issue.votes} votes
                                </button>
                                <span className="text-xs">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        {issue.mediaUrls.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-bold mb-2">Media:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {issue.mediaUrls.map((url, index) => (
                                        <img key={index} src={url} alt={`issue media ${index+1}`} className="w-full object-cover aspect-video win95-inset" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 animate-slide-up">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[75vh] flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white">{issue.title}</h3>
                        <p className="text-sm text-gray-400">{issue.category}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Details</h4>
                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{issue.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => onVote(issue.id)} 
                                    disabled={hasVoted}
                                    title={hasVoted ? "You have already voted" : "Upvote this issue"}
                                    className={`flex items-center gap-2 text-lg font-bold transition-colors ${hasVoted ? 'text-indigo-400 cursor-default' : 'text-white hover:text-indigo-300'}`}
                                >
                                    <ArrowUpCircleIcon className="w-7 h-7" />
                                    <span>{issue.votes}</span>
                                </button>
                            </div>
                            <div className="text-xs text-gray-500">
                                Reported on {new Date(issue.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-white mb-2">Media</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {issue.mediaUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`issue media ${index+1}`} className="rounded-lg object-cover aspect-video bg-gray-700" />
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-white mb-2">Comments</h4>
                            <CommentThread comments={issue.comments} issueId={issue.id} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">AI Assistant</h4>
                        <AgentChat issue={issue} />
                    </div>
                </div>
            </div>
        </div>
    );
};

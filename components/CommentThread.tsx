import React, { useState } from 'react';
import type { Comment } from '../types';
import { PaperAirplaneIcon } from './Icons';

interface CommentThreadProps {
    issueId: string;
    comments: Comment[];
    // In a real app, this would call an API
    // onAddComment: (issueId: string, text: string) => Promise<void>;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comments: initialComments }) => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const comment: Comment = {
            id: `comment-${Date.now()}`,
            author: 'You',
            text: newComment,
            createdAt: Date.now(),
        };
        // Simulate network delay
        setTimeout(() => {
            setComments(prev => [...prev, comment]);
            setNewComment('');
            setIsSubmitting(false);
        }, 300);
    };

    return (
        <div className="space-y-3">
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment.id} className="bg-gray-700/50 p-2 rounded-lg">
                        <p className="text-sm text-gray-300">{comment.text}</p>
                        <p className="text-xs text-gray-500 text-right mt-1">- {comment.author}</p>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    disabled={isSubmitting}
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm disabled:opacity-50"
                />
                <button type="submit" disabled={!newComment.trim() || isSubmitting} className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <PaperAirplaneIcon className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

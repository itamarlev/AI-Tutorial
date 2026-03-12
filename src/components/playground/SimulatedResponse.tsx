'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Sparkles } from 'lucide-react';

interface SimulatedResponseProps {
  // Static content mode (existing behavior)
  content?: string;
  isTyping?: boolean;
  // Streaming mode (new)
  stream?: AsyncIterable<string>;
  // Label - true means real AI (agentic), false means simulated
  isLive?: boolean;
}

export function SimulatedResponse({ 
  content, 
  isTyping = true, 
  stream,
  isLive = false,
}: SimulatedResponseProps) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const abortRef = useRef(false);

  // Streaming mode
  useEffect(() => {
    if (!stream) return;

    setDisplayed('');
    setIsDone(false);
    abortRef.current = false;

    const consumeStream = async () => {
      try {
        for await (const chunk of stream) {
          if (abortRef.current) break;
          setDisplayed((prev) => prev + chunk);
        }
      } catch (error) {
        console.error('Stream error:', error);
        setDisplayed((prev) => prev + '\n\n[Error reading stream]');
      } finally {
        setIsDone(true);
      }
    };

    consumeStream();

    return () => {
      abortRef.current = true;
    };
  }, [stream]);

  // Static content mode (original typewriter behavior)
  useEffect(() => {
    if (stream || content === undefined) return;

    if (!isTyping) {
      setDisplayed(content);
      setIsDone(true);
      return;
    }

    setDisplayed('');
    indexRef.current = 0;
    setIsDone(false);

    const interval = setInterval(() => {
      if (indexRef.current < content.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const nextIndex = Math.min(indexRef.current + chunkSize, content.length);
        setDisplayed(content.slice(0, nextIndex));
        indexRef.current = nextIndex;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [content, isTyping, stream]);

  return (
    <div className={`bg-surface border rounded-lg p-5 ${isLive ? 'border-green-500/30' : 'border-border'}`}>
      <div className="flex items-center gap-2 mb-3">
        {/* Distinct icons for agentic vs simulated */}
        {isLive ? (
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
            <Bot size={16} className="text-green-400" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-claude/20 flex items-center justify-center">
            <Sparkles size={14} className="text-claude-light" />
          </div>
        )}
        
        <span className="text-sm font-medium text-muted">
          {isLive ? 'AI Agent' : 'AI Response'}
        </span>
        
        {/* Status badge */}
        {isLive ? (
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Agentic
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted/20 text-muted font-medium">
            Simulated
          </span>
        )}
        
        {!isDone && <span className="w-2 h-2 rounded-full bg-claude animate-pulse ml-auto" />}
      </div>
      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-code:text-claude-light">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayed}</ReactMarkdown>
      </div>
      {!isDone && <span className="typewriter-cursor" />}
    </div>
  );
}

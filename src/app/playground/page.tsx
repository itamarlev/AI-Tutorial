'use client';

import { useState, useEffect } from 'react';
import { PromptEditor } from '@/components/playground/PromptEditor';
import { SimulatedResponse } from '@/components/playground/SimulatedResponse';
import { getSimulatedResponse } from '@/lib/simulatedResponses';
import { sendPrompt, collectStream, checkHealth } from '@/lib/ai-client';
import { useAIStore } from '@/stores/useAIStore';
import { Card } from '@/components/ui/Card';
import { FlaskConical, Brain, Code, Sparkles, Lightbulb, Zap, ZapOff, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIToolSlug } from '@/types';
import { toast } from 'sonner';

const toolOptions = [
  { slug: 'claude' as AIToolSlug, name: 'Claude', icon: Brain, color: 'text-claude-light', bg: 'bg-claude/10', border: 'border-claude/30' },
  { slug: 'cursor' as AIToolSlug, name: 'Cursor', icon: Code, color: 'text-cursor-light', bg: 'bg-cursor/10', border: 'border-cursor/30' },
  { slug: 'codex' as AIToolSlug, name: 'Codex', icon: Sparkles, color: 'text-codex-light', bg: 'bg-codex/10', border: 'border-codex/30' },
];

const promptTips = [
  'Be specific about what you need',
  'Include context about your tech stack',
  'Specify the desired output format',
  'Use step-by-step instructions for complex tasks',
  'Provide examples of desired output',
  'Set constraints and boundaries',
];

export default function PlaygroundPage() {
  const [selectedTool, setSelectedTool] = useState<AIToolSlug>('claude');
  const [responseStream, setResponseStream] = useState<AsyncIterable<string> | null>(null);
  const [staticResponse, setStaticResponse] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; response: string; tool: string; isLive: boolean }[]>([]);
  const [viewingHistoryIndex, setViewingHistoryIndex] = useState<number | null>(null);

  const { tools, getToolConfig, isToolReady, updateAllAvailability } = useAIStore();

  // Check health on mount
  useEffect(() => {
    checkHealth().then((result) => {
      updateAllAvailability(result);
    });
  }, [updateAllAvailability]);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    setResponseStream(null);
    setStaticResponse(null);

    try {
      const config = getToolConfig(selectedTool);
      const result = await sendPrompt({ tool: selectedTool, prompt, config });

      setIsLive(!result.isSimulated);

      if (result.isSimulated) {
        // For simulated, collect the full string and use static mode
        const content = await collectStream(result.stream);
        setStaticResponse(content);
        setHistory((prev) => [...prev.slice(-9), { prompt, response: content, tool: selectedTool, isLive: false }]);
      } else {
        // For live, tee the stream: display + capture chunks for history
        const chunks: string[] = [];
        const displayStream = async function* () {
          for await (const chunk of result.stream) {
            chunks.push(chunk);
            yield chunk;
          }
          // Stream done — update history with actual content
          setHistory((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex(
              (h) => h.response === '[Streaming...]' && h.prompt === prompt
            );
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], response: chunks.join('') };
            }
            return updated;
          });
        };

        setResponseStream(displayStream());
        setHistory((prev) => [
          ...prev.slice(-9),
          { prompt, response: '[Streaming...]', tool: selectedTool, isLive: true },
        ]);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to get response. Using simulated mode.');
      const content = getSimulatedResponse(prompt, selectedTool);
      setStaticResponse(content);
      setIsLive(false);
      setHistory((prev) => [...prev.slice(-9), { prompt, response: content, tool: selectedTool, isLive: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentToolConfig = getToolConfig(selectedTool);
  const toolReady = isToolReady(selectedTool);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskConical size={24} className="text-claude-light" />
          Playground
        </h1>
        <p className="text-muted mt-1">
          Experiment with AI prompts freely.
          {toolReady ? (
            <span className="text-green-400 ml-1">Real AI connected.</span>
          ) : (
            <span className="ml-1">Responses are simulated for practice.</span>
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tool selector */}
          <div className="flex gap-2 flex-wrap">
            {toolOptions.map((tool) => {
              const config = tools[tool.slug];
              const ready = config.enabled && config.available;
              return (
                <button
                  key={tool.slug}
                  onClick={() => setSelectedTool(tool.slug)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                    selectedTool === tool.slug
                      ? `${tool.bg} ${tool.color} ${tool.border} border`
                      : 'bg-surface border-border text-muted hover:text-foreground'
                  )}
                >
                  <tool.icon size={16} />
                  {tool.name}
                  {ready ? (
                    <Zap size={12} className="text-green-400" />
                  ) : (
                    <ZapOff size={12} className="text-muted/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* AI status indicator */}
          <div className="flex items-center gap-2 text-xs">
            {toolReady ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400">
                  {currentToolConfig.command} connected
                </span>
              </>
            ) : currentToolConfig.enabled ? (
              <>
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-yellow-400">
                  {currentToolConfig.command} not found - using simulated mode
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted" />
                <span className="text-muted">
                  Simulated mode (enable real AI in Settings)
                </span>
              </>
            )}
          </div>

          <PromptEditor
            onSubmit={(prompt) => { setViewingHistoryIndex(null); handleSubmit(prompt); }}
            placeholder={`Ask ${toolOptions.find((t) => t.slug === selectedTool)?.name} anything...`}
            disabled={isLoading}
          />

          {/* Response area — shows either live/new response or a saved history item */}
          {viewingHistoryIndex !== null && history[viewingHistoryIndex] ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted">
                  Viewing saved response for: <span className="text-foreground font-mono">{history[viewingHistoryIndex].prompt}</span>
                </span>
                <button
                  onClick={() => setViewingHistoryIndex(null)}
                  className="text-xs text-claude-light hover:text-claude transition-colors"
                >
                  Dismiss
                </button>
              </div>
              <SimulatedResponse
                content={history[viewingHistoryIndex].response}
                isTyping={false}
                isLive={history[viewingHistoryIndex].isLive}
              />
            </div>
          ) : (
            <>
              {responseStream && (
                <SimulatedResponse stream={responseStream} isLive={isLive} />
              )}
              {staticResponse && !responseStream && (
                <SimulatedResponse content={staticResponse} isLive={isLive} />
              )}
            </>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted">History</h3>
              {history.slice().reverse().map((item, i) => {
                const realIndex = history.length - 1 - i;
                const isViewing = viewingHistoryIndex === realIndex;
                return (
                  <Card
                    key={realIndex}
                    hover
                    className={cn(
                      'p-3 cursor-pointer',
                      item.isLive && 'border-green-500/20',
                      isViewing && 'ring-2 ring-claude/50 bg-claude/5'
                    )}
                    onClick={() => setViewingHistoryIndex(isViewing ? null : realIndex)}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      {item.isLive ? (
                        <Bot size={12} className="text-green-400" />
                      ) : (
                        <Sparkles size={12} className="text-claude-light" />
                      )}
                      <span className="capitalize">{item.tool}</span>
                      {item.isLive ? (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                          <span className="w-1 h-1 rounded-full bg-green-400" />
                          Agentic
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-muted/20 text-muted">Simulated</span>
                      )}
                      {isViewing && <span className="ml-auto text-xs text-claude-light">Viewing</span>}
                    </div>
                    <div className="text-sm font-mono text-foreground truncate">{item.prompt}</div>
                    <div className="text-xs text-muted truncate mt-1">{item.response.slice(0, 100)}...</div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-xp" />
              Prompt Tips
            </h3>
            <ul className="space-y-2">
              {promptTips.map((tip, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="text-claude-light mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">Try These Prompts</h3>
            <div className="space-y-2">
              {[
                'Explain closures in JavaScript',
                'Refactor this function to be more readable',
                'Debug this error: TypeError undefined',
                'Generate unit tests for a login function',
                'Create a React component for a dashboard',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(prompt)}
                  disabled={isLoading}
                  className="w-full text-left text-sm text-muted hover:text-foreground bg-background rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

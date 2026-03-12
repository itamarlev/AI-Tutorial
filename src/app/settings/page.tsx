'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useBadgeStore } from '@/stores/useBadgeStore';
import { useChallengeStore } from '@/stores/useChallengeStore';
import { useAIStore } from '@/stores/useAIStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DAILY_GOALS } from '@/lib/gamification';
import { exportData, importData, downloadJSON, resetAllData } from '@/lib/storage';
import { checkHealth } from '@/lib/ai-client';
import { AIToolSlug } from '@/types';
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Zap, 
  Brain, 
  Code, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const AI_TOOLS: { slug: AIToolSlug; name: string; icon: React.ElementType; color: string }[] = [
  { slug: 'claude', name: 'Claude', icon: Brain, color: 'text-claude-light' },
  { slug: 'cursor', name: 'Cursor', icon: Code, color: 'text-cursor-light' },
  { slug: 'codex', name: 'Codex', icon: Sparkles, color: 'text-codex-light' },
];

export default function SettingsPage() {
  const { profile, updateSettings } = useUserStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [expandedTool, setExpandedTool] = useState<AIToolSlug | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const { 
    tools, 
    setToolEnabled, 
    setToolConfig, 
    updateAllAvailability,
  } = useAIStore();

  // Check health on mount
  useEffect(() => {
    handleCheckHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const customCommands = {
        claude: tools.claude.command,
        cursor: tools.cursor.command,
        codex: tools.codex.command,
      };
      const result = await checkHealth(customCommands);
      updateAllAvailability(result);
      toast.success('Connection status updated');
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Failed to check connections');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleExport = () => {
    const data = exportData();
    downloadJSON(data, 'ai-tutorial-progress.json');
    toast.success('Data exported successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = importData(ev.target?.result as string);
        if (success) {
          toast.success('Data imported! Refresh to see changes.');
        } else {
          toast.error('Failed to import data.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAllData();
    useUserStore.getState().reset();
    useProgressStore.getState().reset();
    useStreakStore.getState().reset();
    useBadgeStore.getState().reset();
    useChallengeStore.getState().reset();
    useAIStore.getState().reset();
    toast.success('All data has been reset.');
    setConfirmReset(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={24} className="text-claude-light" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <h2 className="font-bold mb-4">Daily Goal</h2>
        <div className="grid grid-cols-4 gap-3">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => updateSettings({ dailyGoal: goal })}
              className={`p-3 rounded-lg border text-center transition-all ${
                profile?.dailyGoal === goal
                  ? 'bg-xp/10 border-xp text-xp font-bold'
                  : 'bg-background border-border hover:border-muted text-muted'
              }`}
            >
              {goal} XP
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold mb-4">Animations</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile?.settings.animationsEnabled ?? true}
            onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-border accent-claude"
          />
          <span className="text-sm">Enable animations and transitions</span>
        </label>
      </Card>

      {/* AI Connections Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <Zap size={18} className="text-xp" />
            AI Connections
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCheckHealth}
            disabled={isCheckingHealth}
            className="gap-2"
          >
            {isCheckingHealth ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Test All
          </Button>
        </div>

        <p className="text-sm text-muted mb-4">
          Connect to local AI CLI tools for real responses in the Playground. 
          Falls back to simulated mode if unavailable.
        </p>

        <div className="space-y-3">
          {AI_TOOLS.map((tool) => {
            const config = tools[tool.slug];
            const isExpanded = expandedTool === tool.slug;
            const Icon = tool.icon;

            return (
              <div
                key={tool.slug}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Tool header */}
                <div className="flex items-center gap-3 p-4 bg-surface">
                  <Icon size={20} className={tool.color} />
                  <span className="font-medium flex-1">{tool.name}</span>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    {config.available ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <Check size={12} />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <X size={12} />
                        Not found
                      </span>
                    )}
                  </div>

                  {/* Enable toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => setToolEnabled(tool.slug, e.target.checked)}
                      className="w-4 h-4 rounded border-border accent-green-500"
                    />
                    <span className="text-sm text-muted">Enable</span>
                  </label>

                  {/* Expand button */}
                  <button
                    onClick={() => setExpandedTool(isExpanded ? null : tool.slug)}
                    className="p-1 hover:bg-background rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-muted" />
                    )}
                  </button>
                </div>

                {/* Advanced config */}
                {isExpanded && (
                  <div className="p-4 border-t border-border bg-background space-y-4">
                    <div>
                      <label className="block text-xs text-muted mb-1">
                        CLI Command
                      </label>
                      <input
                        type="text"
                        value={config.command}
                        onChange={(e) =>
                          setToolConfig(tool.slug, { command: e.target.value })
                        }
                        placeholder={tool.slug === 'cursor' ? 'cursor-agent' : tool.slug}
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-claude transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Arguments (comma-separated, added before prompt)
                      </label>
                      <input
                        type="text"
                        value={config.args.join(', ')}
                        onChange={(e) =>
                          setToolConfig(tool.slug, {
                            args: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="-p"
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-claude transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted mb-1">
                        Input Mode
                      </label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`inputMode-${tool.slug}`}
                            checked={config.inputMode === 'pipe'}
                            onChange={() =>
                              setToolConfig(tool.slug, { inputMode: 'pipe' })
                            }
                            className="accent-claude"
                          />
                          <span className="text-sm text-muted">
                            Pipe (stdin)
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`inputMode-${tool.slug}`}
                            checked={config.inputMode === 'arg'}
                            onChange={() =>
                              setToolConfig(tool.slug, { inputMode: 'arg' })
                            }
                            className="accent-claude"
                          />
                          <span className="text-sm text-muted">
                            Argument
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-muted/60 mt-1">
                        Pipe sends the prompt to stdin. Argument appends it after the flags.
                      </p>
                    </div>

                    <div className="text-xs text-muted">
                      Command preview:{' '}
                      <code className="bg-surface px-2 py-1 rounded">
                        {config.inputMode === 'pipe' ? (
                          <>echo &quot;your prompt&quot; | {config.command} {config.args.join(' ')}</>
                        ) : (
                          <>{config.command} {config.args.join(' ')} &quot;your prompt&quot;</>
                        )}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold mb-4">Data Management</h2>
        <div className="space-y-3">
          <Button variant="secondary" onClick={handleExport} className="w-full gap-2">
            <Download size={16} /> Export Progress
          </Button>
          <Button variant="secondary" onClick={handleImport} className="w-full gap-2">
            <Upload size={16} /> Import Progress
          </Button>
          <Button
            variant="danger"
            onClick={handleReset}
            className="w-full gap-2"
          >
            <Trash2 size={16} />
            {confirmReset ? 'Click again to confirm reset' : 'Reset All Data'}
          </Button>
          {confirmReset && (
            <p className="text-xs text-streak text-center">This will delete all your progress permanently!</p>
          )}
        </div>
      </Card>
    </div>
  );
}

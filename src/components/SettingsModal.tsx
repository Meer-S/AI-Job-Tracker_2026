import React, { useState } from 'react';
import { AiSettings, AiProvider } from '../types/job';
import { 
  X, 
  Settings, 
  Key, 
  Cpu, 
  Download, 
  Upload, 
  Check, 
  AlertCircle,
  Database,
  ShieldCheck
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiSettings;
  onSaveSettings: (settings: AiSettings) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File, overwrite: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportJSON,
  onImportJSON,
}) => {
  const [provider, setProvider] = useState<AiProvider>(settings.provider || 'offline');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl || 'http://localhost:11434');
  const [modelName, setModelName] = useState(settings.modelName || 'gpt-4o-mini');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [overwriteImport, setOverwriteImport] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      provider,
      apiKey: apiKey.trim(),
      ollamaUrl: ollamaUrl.trim(),
      modelName: modelName.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleTriggerImport = () => {
    if (importFile) {
      onImportJSON(importFile, overwriteImport);
      setImportFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Copilot & Data Settings</h2>
              <p className="text-xs text-slate-400">100% Privacy — All API Keys saved in LocalStorage only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* AI Provider Config Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                AI Copilot Engine Configuration
              </h3>
              {isSaved && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as AiProvider)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="offline">Smart Offline Engine (No API key needed)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="ollama">Local Ollama Endpoint (Privacy-first LLM)</option>
              </select>
            </div>

            {/* Provider specific inputs */}
            {provider === 'openai' && (
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    placeholder="gpt-4o-mini"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>
              </div>
            )}

            {provider === 'anthropic' && (
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    Anthropic API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-ant-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>
              </div>
            )}

            {provider === 'ollama' && (
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ollama Host URL</label>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ollama Model Name</label>
                  <input
                    type="text"
                    placeholder="llama3"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              Save AI Settings
            </button>
          </form>

          {/* Backup & Data Reliability */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Data Reliability & Backup Portability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export Button */}
              <button
                type="button"
                onClick={onExportJSON}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors flex items-center space-x-3 group"
              >
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Export Backup JSON</div>
                  <div className="text-[10px] text-slate-400">Save full data to local disk</div>
                </div>
              </button>

              {/* Import Section */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                  <span>Import Backup JSON</span>
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="block w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                />
                {importFile && (
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center space-x-2 text-[11px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={overwriteImport}
                        onChange={(e) => setOverwriteImport(e.target.checked)}
                        className="rounded border-slate-700 text-indigo-600"
                      />
                      <span>Overwrite existing cards</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleTriggerImport}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow"
                    >
                      Restore Data
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Your job pipeline data is stored safely in browser IndexedDB (`idb`). No external telemetry or cloud database involved.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

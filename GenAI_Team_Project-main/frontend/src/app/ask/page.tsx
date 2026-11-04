'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Database,
  ExternalLink,
  Send,
  HelpCircle,
  Loader2,
  Bot,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { RAGQueryResponse, GroundedSource, DocumentChunk } from '@/types';
import { Badge } from '@/components/ui/Badge';

function AskContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { openEvidenceDrawer } = useApp();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<RAGQueryResponse[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    api.getSuggestions().then(setSuggestions).catch(() => {
      setSuggestions([
        'What are the main hostel gate curfew timings?',
        'Can parents stay overnight in student rooms?',
        'Are electric kettles or heaters permitted?',
        'What is the minimum duration required to claim a mess rebate?',
        'What is for lunch today?',
        'Check status of complaint CMP-2026-0041',
      ]);
    });

    if (initialQuery) {
      handleAsk(initialQuery);
    }
  }, []);

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || loading) return;
    try {
      setLoading(true);
      setError(null);
      const conversationHistory = history.slice(0, 5).flatMap((item) => [
        { role: 'user', content: item.query },
        { role: 'assistant', content: item.answer },
      ]);
      const res = await api.queryRAG(queryText.trim(), conversationHistory);
      setHistory((prev) => [res, ...prev]);
      setInputQuery('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve answer from policy engine.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setError(null);
  };

  const handleInspect = async (source: GroundedSource) => {
    try {
      const chunk: DocumentChunk = {
        id: `${source.document_id}_chunk_${source.chunk_index}`,
        document_id: source.document_id,
        content: source.snippet,
        page_number: source.page_number,
        chunk_index: source.chunk_index,
        similarity: source.similarity,
        metadata: { doc_title: source.document_title },
      };
      try {
        const fullChunk = await api.getEvidence(`${source.document_id}_chunk_${source.chunk_index}`);
        fullChunk.metadata = { doc_title: source.document_title };
        fullChunk.similarity = source.similarity;
        openEvidenceDrawer(fullChunk);
      } catch {
        openEvidenceDrawer(chunk);
      }
    } catch (e) {
      // fallback
    }
  };

  const getGroundingBadge = (item: RAGQueryResponse) => {
    if (item.query_type === 'structured_menu') {
      return (
        <Badge variant="primary" className="flex items-center space-x-1.5">
          <Database className="h-3 w-3" />
          Structured Menu Database
        </Badge>
      );
    }
    if (item.query_type === 'structured_complaint') {
      return (
        <Badge variant="primary" className="flex items-center space-x-1.5">
          <Database className="h-3 w-3" />
          Complaints Verification Desk
        </Badge>
      );
    }
    if (item.is_grounded) {
      return (
        <Badge variant="success" className="flex items-center space-x-1.5">
          <ShieldCheck className="h-3 w-3" />
          Grounded in Approved Documents ({item.sources.length} sources)
        </Badge>
      );
    }
    return (
      <Badge variant="warning" className="flex items-center space-x-1.5">
        <ShieldAlert className="h-3 w-3" />
        No Approved Document Match
      </Badge>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Policy Assistant Header */}
      <div className="rounded-xl border border-border bg-white p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-shrink-0">
          <div className="flex items-center space-x-2.5 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violetBg text-kare-violet">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-charcoal">
              🤖 HostelIQ Policy Assistant
            </h1>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Retrieval-Augmented Generation grounded exclusively in approved residential handbooks, mess guidelines, and estate regulations.
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-divider hover:text-charcoal transition-smooth self-start sm:self-auto"
          >
            <Search className="h-3 w-3" />
            Clear Conversation
          </button>
        )}
      </div>

      {/* Suggested Questions Grid */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          <HelpCircle className="h-3.5 w-3.5 text-kare-violet" />
          <span>Approved Policy Topics</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(s);
                handleAsk(s);
              }}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-left text-xs text-charcoal hover:border-kare-violet/40 hover:bg-violetBg transition-smooth"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(inputQuery);
        }}
        className="relative flex items-center"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask about curfew, visitors, mess rebates, appliances, or complaint tracking..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-24 text-xs text-charcoal placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="absolute inset-y-0 right-1.5 flex items-center">
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-smooth"
          >
            <span>{loading ? 'Searching...' : 'Ask 🤖'}</span>
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>

      {/* Active Processing Indicator */}
      {loading && (
        <div className="flex items-center space-x-3 rounded-xl border border-border bg-white p-4 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin text-kare-violet" />
          <span>Evaluating semantic similarity across indexed records...</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-status-error/30 bg-status-errorBg p-4 text-xs text-status-error">
          <div className="font-semibold">Query Processing Notice</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Query Answers Thread */}
      <div className="space-y-5">
        {history.map((item, idx) => (
          <div key={idx} className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
            {/* Student Query Box */}
            <div className="border-b border-border bg-white/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <User className="h-3 w-3 text-kare-blue" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    You
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {item.generated_at.slice(11, 16)} UTC
                </span>
              </div>
              <div className="mt-1 text-sm font-medium text-charcoal whitespace-pre-wrap">
                {item.query}
              </div>
            </div>

            {/* Answer Box */}
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violetBg text-kare-violet shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal">
                      HostelIQ AI
                    </span>
                    {getGroundingBadge(item)}
                  </div>
                  {/* Formatted Answer Body */}
                  <div className="text-xs leading-relaxed text-charcoal whitespace-pre-wrap">
                    {item.answer}
                  </div>
                </div>
              </div>

              {/* Source References & Evidence Inspector Trigger */}
              {item.sources && item.sources.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Retrieved Policy Sources:
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {item.sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex flex-col justify-between gap-2 rounded border border-border bg-white p-2.5 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <FileText className="h-3.5 w-3.5 text-kare-indigo" />
                            <span className="text-xs font-semibold text-charcoal truncate">
                              {src.document_title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              \u2022 Page {src.page_number}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">
                            \u201c{src.snippet}\u201d
                          </p>
                        </div>
                        <button
                          onClick={() => handleInspect(src)}
                          className="inline-flex items-center space-x-1 rounded border border-border bg-white px-2.5 py-1 text-[10px] font-medium text-charcoal hover:bg-divider shrink-0"
                        >
                          <span>Inspect Evidence</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Questions */}
              {item.suggested_followups && item.suggested_followups.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <div className="text-[10px] font-semibold text-muted-foreground">
                    Related Policy Inquiries:
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.suggested_followups.map((f, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => {
                          setInputQuery(f);
                          handleAsk(f);
                        }}
                        className="rounded border border-border bg-white px-2 py-1 text-[10px] text-charcoal hover:border-kare-violet/40 hover:bg-violetBg"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {history.length === 0 && !loading && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Bot className="mx-auto h-10 w-10 text-kare-violet" />
            <h3 className="mt-2 text-xs font-semibold text-charcoal">
              No queries submitted in this session
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Select one of the approved policy topics above or type a specific inquiry to search the official hostel regulations handbook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="text-xs text-muted-foreground">Loading assistant interface...</div>}>
      <AskContent />
    </Suspense>
  );
}


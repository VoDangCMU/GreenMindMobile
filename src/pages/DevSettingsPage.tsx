"use client";

import { useState, useEffect } from "react";
import SafeAreaLayout from "@/components/layouts/SafeAreaLayout";
import AppHeader from "@/components/common/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Trash, Copy, ChevronDown, ChevronUp } from "lucide-react";
import RequestDetailCard from "@/components/dev/RequestDetailCard";
import { useDevSettingsStore } from "@/store/devSettingsStore";

export default function DevSettingsPage() {
  const inspectRequests = useDevSettingsStore((s) => s.inspectRequests);
  const enableLogging = useDevSettingsStore((s) => s.enableLogging);
  const setInspectRequests = useDevSettingsStore((s) => s.setInspectRequests);
  const setEnableLogging = useDevSettingsStore((s) => s.setEnableLogging);
  const reset = useDevSettingsStore((s) => s.reset);

  // Helper to pretty-print JSON strings or objects
  const prettyJson = (val: any) => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') {
      try { return JSON.stringify(JSON.parse(val), null, 2); } catch (e) { return val; }
    }
    try { return JSON.stringify(val, null, 2); } catch (e) { return String(val); }
  };

  const [logsPreview, setLogsPreview] = useState<string[]>([]);
  const [requestsPreview, setRequestsPreview] = useState<any[]>([]);

  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);
  const [expandedRequests, setExpandedRequests] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const toggleExpandedLog = (i: number) => setExpandedLogs((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const toggleExpandedRequest = (i: number) => setExpandedRequests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const openRequestDetail = (r: any) => setSelectedRequest(r);
  const closeRequestDetail = () => setSelectedRequest(null);

  const loadPreviews = () => {
    try {
      setLogsPreview(JSON.parse(localStorage.getItem("dev_logs") || "[]"));
    } catch (e) {
      setLogsPreview([]);
    }
    try {
      setRequestsPreview(JSON.parse(localStorage.getItem("dev_requests") || "[]"));
    } catch (e) {
      setRequestsPreview([]);
    }
  };

  useEffect(() => {
    loadPreviews();
  }, []);

  const handleClearLogs = () => {
    localStorage.removeItem("dev_logs");
    setLogsPreview([]);
    toast.success("Cleared dev logs");
  };

  const handleClearRequests = () => {
    localStorage.removeItem("dev_requests");
    setRequestsPreview([]);
    toast.success("Cleared dev requests");
  };

  return (
    <SafeAreaLayout header={<AppHeader showBack title="Dev Settings" />}>
      <div className="max-w-sm mx-auto p-4 space-y-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Developer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="inspectRequests"
                checked={inspectRequests}
                onCheckedChange={(c) => {
                  setInspectRequests(Boolean(c));
                  toast.success(`Inspect Requests ${c ? "ON" : "OFF"}`);
                }}
                className="mt-1"
              />
              <div>
                <Label htmlFor="inspectRequests" className="text-sm font-medium cursor-pointer">
                  Inspect Requests
                </Label>
                <div className="text-xs text-gray-500">When enabled, requests can be captured locally for debugging (UI-only).</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="enableLogging"
                checked={enableLogging}
                onCheckedChange={(c) => {
                  setEnableLogging(Boolean(c));
                  toast.success(`Logging ${c ? "ON" : "OFF"}`);
                }}
                className="mt-1"
              />
              <div>
                <Label htmlFor="enableLogging" className="text-sm font-medium cursor-pointer">
                  Enable Logging
                </Label>
                <div className="text-xs text-gray-500">When enabled, additional debug logs are retained locally.</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="showCatalogueFab"
                checked={useDevSettingsStore((s) => s.showCatalogueFab)}
                onCheckedChange={(c) => {
                  useDevSettingsStore.getState().setShowCatalogueFab(Boolean(c));
                  toast.success(`Show Catalogue FAB ${c ? "ON" : "OFF"}`);
                }}
                className="mt-1"
              />
              <div>
                <Label htmlFor="showCatalogueFab" className="text-sm font-medium cursor-pointer">
                  Show Catalogue FAB
                </Label>
                <div className="text-xs text-gray-500">When enabled, a floating Catalogue button appears on the Home page (dev-only).</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700">Dev Logs</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{logsPreview.length}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClearLogs} aria-label="Clear logs">
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { loadPreviews(); toast.success("Refreshed logs preview") }}>Refresh</Button>
                </div>
              </div>

              <div className="mt-2 p-0 rounded bg-white border">
                {logsPreview && logsPreview.length > 0 ? (
                  <ul className="max-h-48 overflow-auto divide-y">
                    {logsPreview.slice().reverse().map((l, i) => {
                      const level = l.includes('ERROR:') ? 'error' : l.includes('WARN:') ? 'warn' : l.includes('INFO:') ? 'info' : 'log';
                      const colorClass = level === 'error' ? 'text-red-600 bg-red-50' : level === 'warn' ? 'text-yellow-700 bg-yellow-50' : level === 'info' ? 'text-blue-600 bg-blue-50' : 'text-gray-800 bg-gray-50';
                      const [tsRaw, ...rest] = l.split(' ');
                      const rawMessage = rest.join(' ');
                      let ts = tsRaw;
                      try {
                        const d = new Date(tsRaw);
                        if (!isNaN(d.getTime())) ts = d.toLocaleString();
                      } catch (e) {
                        // keep raw
                      }
                      const isExpanded = expandedLogs.includes(i);
                      const preview = rawMessage.length > 140 && !isExpanded ? rawMessage.slice(0, 140) + '...' : rawMessage;

                      return (
                        <li key={i} className="p-2">
                          <div className="flex items-start gap-3">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${colorClass} shrink-0`}>{level.toUpperCase()}</span>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-xs text-gray-500 truncate">{ts}</div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(l); toast.success('Copied log'); }}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => toggleExpandedLog(i)}>
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>

                              <pre className={`text-sm font-mono mt-1 break-words ${isExpanded ? '' : 'line-clamp-3'}`} style={{whiteSpace: 'pre-wrap'}}>{preview}</pre>

                              {isExpanded && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  <div className="font-medium">Full log</div>
                                  <div className="mt-1 whitespace-pre-wrap break-words text-[13px]">{rawMessage}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-3 text-gray-400">No logs available</div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700">Captured Requests</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{requestsPreview.length}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleClearRequests} aria-label="Clear requests">
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { loadPreviews(); toast.success("Refreshed requests preview") }}>Refresh</Button>
                </div>
              </div>

              <div className="mt-2 p-0 rounded bg-white border">
                {requestsPreview && requestsPreview.length > 0 ? (
                  <ul className="max-h-48 overflow-auto divide-y">
                    {requestsPreview.map((r: any, i: number) => {
                      const statusNum = Number(r.status) || 0;
                      const hasStatus = statusNum > 0;
                      const isError = !!r.error || statusNum >= 500;
                      const isWarn = hasStatus && statusNum >= 400 && statusNum < 500;
                      const isSuccess = hasStatus && statusNum < 400;
                      const statusClass = isError ? 'text-red-600 bg-red-50' : isWarn ? 'text-yellow-700 bg-yellow-50' : isSuccess ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-100';
                      const statusText = r.error ? 'ERROR' : hasStatus ? `${statusNum}` : 'UNKNOWN';
                      const isExpanded = expandedRequests.includes(i);
                      const shortUrl = r.url?.length > 120 ? r.url.slice(0, 120) + '...' : r.url;

                      return (
                        <li key={i} className="p-2">
                          <div className="flex items-start gap-3">
                            <button onClick={(e) => { e.stopPropagation(); openRequestDetail(r); }} aria-label="Open request detail" className="p-1 rounded-md hover:bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>

                            <div className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusClass} shrink-0`}>{statusText}</div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{r.method}</div>
                                  <div className="text-xs font-medium truncate">{shortUrl}</div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <div className="text-xs text-gray-500">{r.ts}{r.duration ? ` · ${r.duration}ms` : ''}</div>
                                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${r.method} ${r.url}`); }} aria-label="Copy request">
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleExpandedRequest(i); }} aria-label="Toggle request preview">
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  {r.error && (<div className="text-red-600 font-medium">Error: {r.error}</div>)}
                                  {r.requestBody && (
                                    <div className="mt-1">
                                      <div className="font-medium">Request body</div>
                                      <pre className="font-mono text-[13px] whitespace-pre-wrap break-words max-w-full max-h-40 overflow-auto rounded bg-gray-50 p-2">{prettyJson(r.requestBody)}</pre>
                                    </div>
                                  )}
                                  {r.responseBody && (
                                    <div className="mt-1">
                                      <div className="font-medium">Response</div>
                                      <pre className="font-mono text-[13px] whitespace-pre-wrap break-words max-w-full max-h-40 overflow-auto rounded bg-gray-50 p-2">{prettyJson(r.responseBody)}</pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-3 text-gray-400">No requests captured</div>
                )}
              </div>

              {selectedRequest && (
                <RequestDetailCard request={selectedRequest} onClose={closeRequestDetail} />
              )}
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Catalogue</CardTitle>
                <CardDescription>Quick links to the app pages (click to navigate / copy path)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {(
                    [
                      { path: '/', label: 'Login' },
                      { path: '/register', label: 'Register' },
                      { path: '/onboarding', label: 'Onboarding' },
                      { path: '/onboarding-quiz', label: 'Onboarding Quiz' },
                      { path: '/home', label: 'Home' },
                      { path: '/checkins', label: 'Checkins' },
                      { path: '/profile', label: 'Profile' },
                      { path: '/metrics', label: 'Metrics' },
                      { path: '/survey-list', label: 'Surveys' },
                      { path: '/plant-scan', label: 'Plant Scan' },
                      { path: '/invoice-history', label: 'Invoice History' },
                      { path: '/todo', label: 'Todo' },
                      { path: '/dev-settings', label: 'Dev Settings' },
                      { path: '/debug/quiz', label: 'Debug Quiz' },
                      { path: '/notifications', label: 'Notifications' }
                    ]
                  ).map((r) => (
                    <div key={r.path} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <Link to={r.path} className="text-sm font-medium text-foreground hover:underline">{r.label}</Link>
                        <span className="text-xs text-muted-foreground">{r.path}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(r.path);
                            toast.success("Copied path");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="pt-3">
              <Button variant="outline" onClick={() => { reset(); toast.success("Reset dev settings"); }}>
                Reset Dev Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SafeAreaLayout>
  );
}

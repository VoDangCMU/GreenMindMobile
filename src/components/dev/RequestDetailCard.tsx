"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function RequestDetailCard({ request, onClose }: { request: any; onClose: () => void }) {
  if (!request) return null;

  // Pretty-print helper: accepts string or object
  const prettyJson = (val: any) => {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') {
      try { return JSON.stringify(JSON.parse(val), null, 2); } catch (e) { return val; }
    }
    try { return JSON.stringify(val, null, 2); } catch (e) { return String(val); }
  };

  // Try to parse a string as JSON, or return original
  const parseIfPossible = (val: any) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return val; }
    }
    return val;
  };

  // Escape HTML for safe insertion
  const escapeHtml = (unsafe: string) => {
    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Very small JSON highlighter that wraps keys/strings/numbers/booleans/null with spans
  const highlightJson = (val: any) => {
    const txt = prettyJson(val);
    if (!txt) return '';
    const esc = escapeHtml(txt);

    // Highlight keys: "key":
    let highlighted = esc.replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-emerald-300">"$1"</span>');
    // Highlight string values: "value"
    highlighted = highlighted.replace(/:\s*"([^"]*)"/g, ': <span class="text-amber-200">"$1"</span>');
    // Highlight numbers/booleans/null
    highlighted = highlighted.replace(/(:\s*)(-?\d+\.?\d*e?[+-]?\d*|true|false|null)/gi, '$1<span class="text-pink-200">$2</span>');
    // Punctuations (brackets) subtle color
    highlighted = highlighted.replace(/(\{|\}|\[|\])/g, '<span class="text-slate-400">$1</span>');
    return highlighted;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const handleDownload = (obj: any, filename = "request.json") => {
    const blob = new Blob([typeof obj === "string" ? obj : JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 9998 }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 9999, width: 'min(880px,95%)', margin: '48px auto', maxHeight: 'calc(100vh - 96px)', overflow: 'auto' }}>
        <Card className="shadow-lg" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Request Detail</CardTitle>
                <CardDescription className="text-xs text-gray-500">View actual request and response</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(`${request.method} ${request.url}`)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(request, `request-${request.ts || Date.now()}.json`)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">Summary</div>
                  <div className="text-xs text-gray-500">{request.ts}{request.duration ? ` · ${request.duration}ms` : ''}</div>
                </div>

                <div className="mt-2 bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{request.method}</div>
                    <div className="text-sm font-medium min-w-0">
                      <div className="overflow-x-auto max-w-full whitespace-nowrap text-sm">{request.url}</div>
                    </div>
                    <div className="ml-auto text-xs font-semibold">{request.status ? request.status : (request.error ? 'ERROR' : 'UNKNOWN')}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Request</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(JSON.stringify(request.requestHeaders || {}, null, 2))}>Copy headers</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(prettyJson(request.requestBody || {}))}>Copy body</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload({ headers: request.requestHeaders || {}, body: parseIfPossible(request.requestBody) }, `request-${request.ts || Date.now()}.json`)}>Download</Button>
                  </div>
                </div>

                <div className="mt-2 bg-white border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">Headers</div>
                    <div className="text-xs text-slate-500">{Object.keys(request.requestHeaders || {}).length} entries</div>
                  </div>
                  <pre className="mt-1 font-mono text-[13px] whitespace-pre-wrap break-all max-w-full max-h-52 overflow-auto rounded bg-slate-900 text-slate-100 p-3"><code dangerouslySetInnerHTML={{ __html: highlightJson(request.requestHeaders || {}) }} /></pre>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs font-semibold text-slate-700">Body</div>
                    <div className="text-xs text-slate-500">{String(prettyJson(request.requestBody)).length} chars</div>
                  </div>
                  <pre className="mt-1 font-mono text-[13px] whitespace-pre-wrap break-all max-w-full max-h-52 overflow-auto rounded bg-slate-900 text-slate-100 p-3"><code dangerouslySetInnerHTML={{ __html: highlightJson(request.requestBody) }} /></pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Response</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(JSON.stringify(request.responseHeaders || {}, null, 2))}>Copy headers</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(prettyJson(request.responseBody || {}))}>Copy body</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload({ status: request.status, headers: request.responseHeaders || {}, body: parseIfPossible(request.responseBody) }, `response-${request.ts || Date.now()}.json`)}>Download</Button>
                  </div>
                </div>

                <div className="mt-2 bg-white border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">Headers</div>
                    <div className="text-xs text-slate-500">{Object.keys(request.responseHeaders || {}).length} entries</div>
                  </div>
                  <pre className="mt-1 font-mono text-[13px] whitespace-pre-wrap break-all max-w-full max-h-52 overflow-auto rounded bg-slate-900 text-slate-100 p-3"><code dangerouslySetInnerHTML={{ __html: highlightJson(request.responseHeaders || {}) }} /></pre>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs font-semibold text-slate-700">Body</div>
                    <div className="text-xs text-slate-500">{String(prettyJson(request.responseBody)).length} chars</div>
                  </div>
                  <pre className="mt-1 font-mono text-[13px] whitespace-pre-wrap break-all max-w-full max-h-52 overflow-auto rounded bg-slate-900 text-slate-100 p-3"><code dangerouslySetInnerHTML={{ __html: highlightJson(request.responseBody) }} /></pre>
                </div>

                {request.error && (
                  <div className="mt-2 text-red-600 font-medium">Error: {request.error}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useDevSettingsStore } from "@/store/devSettingsStore";

const LOG_KEY = "dev_logs";
const REQ_KEY = "dev_requests";
const MAX_ENTRIES = 300;

function readArray(key: string): any[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeArray(key: string, arr: any[]) {
  try {
    localStorage.setItem(key, JSON.stringify(arr.slice(-MAX_ENTRIES)));
  } catch (e) {
    // noop
  }
}

export function appendDevLog(item: string) {
  const arr = readArray(LOG_KEY);
  arr.push(`${new Date().toISOString()} ${item}`);
  writeArray(LOG_KEY, arr);
}

export function appendDevRequest(obj: any) {
  const arr = readArray(REQ_KEY);
  arr.push({ ts: new Date().toISOString(), ...obj });
  writeArray(REQ_KEY, arr);
}

export function getDevLogs() {
  return readArray(LOG_KEY);
}

export function getDevRequests() {
  return readArray(REQ_KEY);
}

export function clearDevLogs() {
  writeArray(LOG_KEY, []);
}

export function clearDevRequests() {
  writeArray(REQ_KEY, []);
}

export function initDevTools() {
  // Ensure we only init once
  if ((window as any).__devToolsInit) return;
  (window as any).__devToolsInit = true;

  // Wrap console methods to capture logs when enabled
  const cons = console as any;
  ["log", "warn", "error", "info"].forEach((method) => {
    const orig = cons[method].bind(console);
    cons[method] = (...args: any[]) => {
      try {
        orig(...args);
        const enabled = useDevSettingsStore.getState().enableLogging;
        if (enabled) {
          const text = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
          appendDevLog(`${method.toUpperCase()}: ${text}`);
        }
      } catch (e) {
        orig(...args);
      }
    };
  });

  // Wrap fetch to capture requests when inspectRequests is enabled
  if (typeof window.fetch === "function") {
    const origFetch = window.fetch.bind(window);
    window.fetch = async (input: any, init?: any) => {
      const url = typeof input === "string" ? input : input?.url || String(input);
      const method = init?.method || (typeof input === "object" && input?.method) || "GET";
      const start = Date.now();
      // collect request info
      const requestBody = init?.body ?? (typeof input === 'object' ? input?.body : undefined);
      const requestHeaders = init?.headers ?? (typeof input === 'object' ? input?.headers : undefined);
      try {
        const res = await origFetch(input, init);
        const duration = Date.now() - start;
        try {
          const ins = useDevSettingsStore.getState().inspectRequests;
          if (ins) {
            // try to read response body safely
            let responseBody: any = undefined;
            try {
              const clone = res.clone();
              responseBody = await clone.text();
            } catch (e) {
              responseBody = undefined;
            }

            const responseHeaders: Record<string, string> = {};
            try {
              res.headers.forEach((value: string, key: string) => {
                responseHeaders[key] = value;
              });
            } catch (e) {}

            appendDevRequest({
              url,
              method,
              status: res.status,
              duration,
              ok: res.ok,
              requestBody,
              requestHeaders,
              responseBody,
              responseHeaders,
            });
          }
        } catch (e) {
          // noop
        }
        return res;
      } catch (err) {
        try {
          const ins = useDevSettingsStore.getState().inspectRequests;
          if (ins) appendDevRequest({ url, method, error: String(err), requestBody, requestHeaders });
        } catch (e) {}
        throw err;
      }
    };
  }

  // Wrap XMLHttpRequest to capture network calls made via XHR
  try {
    const OrigXHR = (window as any).XMLHttpRequest;
    function WrappedXHR(this: any) {
      const xhr = new OrigXHR();
      const origOpen = xhr.open.bind(xhr);
      const origSend = xhr.send.bind(xhr);
      let _url = "";
      let _method = "";
      let _body: any = undefined;
      let _start = 0;

      xhr.open = function (method: string, url: string, ...rest: any[]) {
        _method = method;
        _url = url;
        return origOpen(method, url, ...rest);
      };

      xhr.send = function (body?: any) {
        _body = body;
        _start = Date.now();
        return origSend(body);
      };

      xhr.addEventListener("loadend", function () {
        try {
          const ins = useDevSettingsStore.getState().inspectRequests;
          if (ins) {
            const duration = _start ? Date.now() - _start : 0;
            // try to parse response headers
            const responseHeaders: Record<string, string> = {};
            try {
              const raw = xhr.getAllResponseHeaders();
              raw.split(/\r?\n/).forEach((line: string) => {
                const idx = line.indexOf(':');
                if (idx > 0) {
                  const key = line.slice(0, idx).trim().toLowerCase();
                  const val = line.slice(idx + 1).trim();
                  responseHeaders[key] = val;
                }
              });
            } catch (e) {}

            const responseBody = (() => {
              try { return xhr.responseText; } catch (e) { return undefined; }
            })();

            appendDevRequest({ url: _url, method: _method, status: xhr.status, duration, xhr: true, requestBody: _body, responseBody, responseHeaders });
          }
        } catch (e) {}
      });
      return xhr;
    }
    (window as any).XMLHttpRequest = WrappedXHR as any;
  } catch (e) {
    // ignore
  }

  // Initial marker
  try {
    const enabled = useDevSettingsStore.getState().enableLogging;
    if (enabled) appendDevLog("Dev tools initialized");
  } catch (e) {}
}

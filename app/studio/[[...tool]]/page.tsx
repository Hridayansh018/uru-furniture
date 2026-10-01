"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Code2,
  Database,
  Play,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Sparkles,
  Key,
  Shield,
  Globe,
  RefreshCw
} from "lucide-react";
import { PRODUCTS } from "@/lib/products";

interface SanityStatusResponse {
  ok: boolean;
  status: "connected" | "unconfigured" | "error";
  projectId: string | null;
  dataset: string;
  apiVersion: string;
  hasToken: boolean;
  productCount?: number;
  sampleFound?: boolean;
  message: string;
  error?: string;
  advice?: string;
}

export default function StudioPage() {
  const [projectId, setProjectId] = useState<string>("");
  const [dataset, setDataset] = useState<string>("production");
  const [apiVersion, setApiVersion] = useState<string>("2024-01-01");
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "credentials" | "groq" | "schema" | "seed">("overview");

  // Connection testing state
  const [testResult, setTestResult] = useState<SanityStatusResponse | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // GROQ query runner state
  const [groqQuery, setGroqQuery] = useState<string>(
    '*[_type == "product"] | order(name asc) {\n  name,\n  "slug": slug.current,\n  price,\n  dimensions,\n  "mainImageUrl": mainImage.asset->url\n}'
  );
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
    const ds = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const ver = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
    setProjectId(pid);
    setDataset(ds);
    setApiVersion(ver);
    setIsConfigured(Boolean(pid && pid !== "your_sanity_project_id" && pid.trim().length > 0));

    // Automatically check connection status on mount
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/sanity/status", { cache: "no-store" });
      const data: SanityStatusResponse = await res.json();
      setTestResult(data);
      if (data.projectId) setProjectId(data.projectId);
      if (data.dataset) setDataset(data.dataset);
      setIsConfigured(data.ok || Boolean(data.projectId && data.projectId.trim().length > 0));
    } catch (err) {
      setTestResult({
        ok: false,
        status: "error",
        projectId: null,
        dataset: "production",
        apiVersion: "2024-01-01",
        hasToken: false,
        message: `Failed to ping status endpoint: ${String(err)}`,
        advice: "Ensure the local development server is running.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunQuery = async () => {
    setIsQuerying(true);
    setQueryResult(null);
    try {
      const res = await fetch("/api/sanity/products");
      const data = await res.json();
      setQueryResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setQueryResult(JSON.stringify({ error: "Failed to execute query", details: String(err) }, null, 2));
    } finally {
      setIsQuerying(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  // Generate NDJSON seed data for Sanity CLI import
  const ndjsonSeed = PRODUCTS.map((p) =>
    JSON.stringify({
      _type: "product",
      _id: `product-${p.id}`,
      name: p.name,
      slug: { _type: "slug", current: p.id },
      subtitle: p.subtitle,
      description: p.desc,
      price: p.price,
      priceNum: p.priceNum,
      dimensions: p.dimensions,
      configurations: p.configs,
      fabrics: p.fabrics,
      colors: p.colors,
    })
  ).join("\n");

  const envSnippet = `# Sanity.io CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID="${projectId || "your_project_id"}"
NEXT_PUBLIC_SANITY_DATASET="${dataset}"
NEXT_PUBLIC_SANITY_API_VERSION="${apiVersion}"

# Secret API Token (Never prefix with NEXT_PUBLIC_)
SANITY_API_READ_TOKEN="your_sanity_viewer_or_editor_token"`;

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#171614] flex flex-col font-sans">
      {/* Studio Header */}
      <header className="sticky top-0 z-30 bg-[#fffefa]/95 backdrop-blur-md border-b border-[#ded9d0]">
        <div className="max-w-[1240px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl tracking-[0.16em] hover:opacity-80">
              URU
            </Link>
            <span className="text-[#ded9d0] font-light">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse" />
              <span className="font-serif text-lg font-medium">Sanity.io Studio Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                testResult?.ok
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : isConfigured
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {testResult?.ok
                  ? `Sanity Connected (${testResult.productCount ?? 0} items)`
                  : isConfigured
                  ? `Sanity: ${projectId}`
                  : "Sanity: Awaiting Credentials"}
              </span>
            </div>

            {isConfigured && (
              <a
                href={`https://${projectId}.sanity.studio`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold bg-[#211d19] hover:bg-black text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Launch Cloud Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <Link
              href="/"
              className="text-xs font-medium text-[#716c65] hover:text-[#171614] px-3 py-1.5 rounded-full border border-[#ded9d0] hover:bg-[#eae5dc]"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-5 py-8 space-y-8">
        {/* Banner */}
        <section className="bg-[#fffefa] border border-[#ded9d0] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider">
                Sanity CMS Quickstart
              </span>
              <span className="text-xs text-[#8a847b]">Next.js 15 App Router</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#171614]">
              URU Furniture Content Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#716c65] leading-relaxed">
              Manage your Cloud Sofa collection schemas, tactile fabrics, pricing tiers, and lifestyle image assets via Sanity.io.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-[#f5f3ef] text-[#171614] border border-[#ded9d0] rounded-full font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
              <span>{isTesting ? "Testing..." : "Test Connection"}</span>
            </button>

            {isConfigured ? (
              <a
                href={`https://${projectId}.sanity.studio`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#211d19] hover:bg-black text-white rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Open Sanity Studio</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="https://www.sanity.io/docs/next-js-quickstart/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#211d19] hover:bg-black text-white rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Sanity Quickstart Docs</span>
              </a>
            )}
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#ded9d0] pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Studio Overview & Diagnostics" },
            { id: "credentials", label: "Credentials & Secrets Guide" },
            { id: "groq", label: "GROQ Query Explorer" },
            { id: "schema", label: "Product Schema Definition" },
            { id: "seed", label: "Seed Dataset (NDJSON)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#211d19] text-white shadow-sm"
                  : "bg-white text-[#716c65] hover:text-[#171614] border border-[#ded9d0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Live Status */}
              <div className="bg-[#fffefa] border border-[#ded9d0] p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#716c65]" />
                    <h3 className="font-serif text-lg font-medium text-[#171614]">Connection Diagnostics</h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    className="text-xs text-[#716c65] hover:text-[#171614] underline"
                  >
                    Refresh
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#ded9d0]">
                    <span className="text-[#716c65]">Project ID:</span>
                    <code className="font-mono font-semibold text-[#171614]">{projectId || "Not configured"}</code>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#ded9d0]">
                    <span className="text-[#716c65]">Dataset:</span>
                    <code className="font-mono font-semibold text-[#171614]">{dataset}</code>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#ded9d0]">
                    <span className="text-[#716c65]">API Version:</span>
                    <code className="font-mono font-semibold text-[#171614]">{apiVersion}</code>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#ded9d0]">
                    <span className="text-[#716c65]">Secret Token:</span>
                    <span className={`font-semibold ${testResult?.hasToken ? "text-emerald-700" : "text-[#716c65]"}`}>
                      {testResult?.hasToken ? "Present (Server Secret)" : "None (Public Reads)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#716c65]">Diagnostic:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        testResult?.ok
                          ? "text-emerald-700"
                          : isConfigured
                          ? "text-blue-700"
                          : "text-amber-700"
                      }`}
                    >
                      {testResult?.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {testResult?.ok
                        ? "Active & Verified"
                        : isConfigured
                        ? "Configured"
                        : "Awaiting Credentials"}
                    </span>
                  </div>
                </div>

                {testResult?.message && (
                  <div
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      testResult.ok
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    <span className="font-semibold block">
                      {testResult.ok ? "Connected:" : "Notice:"}
                    </span>
                    <p className="text-[11px] leading-relaxed">{testResult.message}</p>
                    {testResult.advice && (
                      <p className="text-[11px] text-[#716c65] pt-1 border-t border-amber-200/50">
                        <strong>Advice:</strong> {testResult.advice}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Card 2: Credentials Snippet */}
              <div className="bg-[#fffefa] border border-[#ded9d0] p-6 rounded-3xl shadow-sm space-y-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#716c65]" />
                    <h3 className="font-serif text-lg font-medium text-[#171614]">
                      Credentials in .env.local
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(envSnippet, "env")}
                    className="text-xs text-[#716c65] hover:text-[#171614] flex items-center gap-1 font-semibold"
                  >
                    {copied === "env" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied === "env" ? "Copied" : "Copy Template"}</span>
                  </button>
                </div>

                <pre className="p-4 bg-[#211d19] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {envSnippet}
                </pre>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#716c65] pt-1">
                  <div className="p-3 bg-[#f7f5f0] rounded-xl border border-[#ded9d0]">
                    <strong className="text-[#171614] block mb-1">1. Project ID</strong>
                    <p>Found at <a href="https://sanity.io/manage" target="_blank" className="text-blue-600 underline">sanity.io/manage</a> at the top of your project page.</p>
                  </div>
                  <div className="p-3 bg-[#f7f5f0] rounded-xl border border-[#ded9d0]">
                    <strong className="text-[#171614] block mb-1">2. Secret Token</strong>
                    <p>Generated in <strong>API → Tokens → Add API Token</strong>. Keep server-only (no NEXT_PUBLIC_).</p>
                  </div>
                  <div className="p-3 bg-[#f7f5f0] rounded-xl border border-[#ded9d0]">
                    <strong className="text-[#171614] block mb-1">3. CORS Origin</strong>
                    <p>In <strong>API → CORS Origins</strong>, add <code className="font-mono text-[10px]">http://localhost:3000</code> with credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-5 rounded-2xl bg-white border border-[#ded9d0] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-[#57534e]">
                  Ready to import the 6 Cloud Sofa models into Sanity? View our pre-formatted seed dataset.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("seed")}
                className="px-4 py-2 bg-[#211d19] hover:bg-black text-white rounded-full font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>View NDJSON Seed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Dedicated Credentials & Secrets Guide */}
        {activeTab === "credentials" && (
          <div className="bg-[#fffefa] border border-[#ded9d0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-8">
            <div className="border-b border-[#ded9d0] pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#b45309]" />
                <h3 className="font-serif text-2xl font-medium text-[#171614]">
                  Step-by-Step: Setting Up Sanity Credentials and Secrets
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#716c65]">
                Everything you need to configure your Sanity project, find your Project ID, generate secret API tokens, and whitelist CORS origins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-[#f7f5f0] border border-[#ded9d0] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1c1917]">
                    Create a Sanity Account & Project
                  </h4>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Go to <a href="https://sanity.io" target="_blank" className="text-blue-600 underline font-medium">sanity.io</a> and sign in with GitHub or Google. In your management dashboard (<a href="https://sanity.io/manage" target="_blank" className="text-blue-600 underline">sanity.io/manage</a>), click <strong>Create project</strong> and name it <code className="bg-white px-1.5 py-0.5 rounded font-mono">uru-furniture</code>.
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#ded9d0] text-[11px] text-[#78716c]">
                  <strong>Default Dataset:</strong> Keep the default dataset name as <code className="font-mono text-[#1c1917]">production</code>.
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-[#f7f5f0] border border-[#ded9d0] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1c1917]">
                    Locate Project ID and Dataset
                  </h4>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Open your project at <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">sanity.io/manage/personal/project/&lt;id&gt;</code>. Your <strong>Project ID</strong> is displayed at the top of the page under the project name (an 8-character string, e.g. <code className="font-mono">k3y8abcd</code>).
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#ded9d0] text-[11px] text-[#78716c]">
                  This is a public variable: configure it as <code className="font-mono text-[#1c1917]">NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-[#f7f5f0] border border-[#ded9d0] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1c1917]">
                    Generate Secret API Token (Never Public!)
                  </h4>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  In your Sanity dashboard, click the <strong>API</strong> tab at the top, then scroll down to <strong>Tokens</strong>. Click <strong>Add API token</strong>:
                </p>
                <ul className="text-xs text-[#57534e] list-disc list-inside space-y-1 pl-1">
                  <li><strong>Label:</strong> URU Furniture Backend</li>
                  <li><strong>Permissions:</strong> Choose <em>Viewer</em> (for public content) or <em>Editor</em> (if syncing updates)</li>
                </ul>
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-[11px]">
                  <strong>CRITICAL SECURITY RULE:</strong> Name this variable <code className="font-mono font-semibold">SANITY_API_READ_TOKEN</code>. Never add <code className="font-mono">NEXT_PUBLIC_</code> to secret tokens.
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-[#f7f5f0] border border-[#ded9d0] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1c1917] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-serif text-base font-semibold text-[#1c1917]">
                    Configure CORS Origins
                  </h4>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  In the same <strong>API</strong> tab, locate <strong>CORS Origins</strong> and click <strong>Add CORS origin</strong>:
                </p>
                <div className="space-y-1.5 text-xs text-[#57534e]">
                  <div className="p-2.5 bg-white rounded-lg border border-[#ded9d0] font-mono text-[11px] flex justify-between">
                    <span>http://localhost:3000</span>
                    <span className="text-emerald-700 font-bold">Credentials: Yes</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#ded9d0] font-mono text-[11px] flex justify-between">
                    <span>https://*.run.app</span>
                    <span className="text-emerald-700 font-bold">Credentials: Yes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete env file reference */}
            <div className="space-y-3 pt-4 border-t border-[#ded9d0]">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg text-[#1c1917]">
                  Final Configuration (.env.local)
                </h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(envSnippet, "full-env")}
                  className="px-3 py-1 bg-[#211d19] text-white rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  {copied === "full-env" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === "full-env" ? "Copied" : "Copy All"}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#211d19] text-neutral-200 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                {envSnippet}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: GROQ Query Explorer */}
        {activeTab === "groq" && (
          <div className="bg-[#fffefa] border border-[#ded9d0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded9d0]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#171614]">GROQ Query Explorer</h3>
                <p className="text-xs text-[#716c65]">
                  Test your GROQ content queries against Sanity CMS via our Next.js API client (<code className="font-mono">/api/sanity/products</code>).
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunQuery}
                disabled={isQuerying}
                className="px-5 py-2.5 bg-[#211d19] hover:bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isQuerying ? "Executing..." : "Run Query"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#716c65] uppercase tracking-wider block">
                  GROQ Expression
                </label>
                <textarea
                  value={groqQuery}
                  onChange={(e) => setGroqQuery(e.target.value)}
                  rows={8}
                  className="w-full p-4 bg-[#211d19] text-neutral-200 font-mono text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#171614]"
                />
                <span className="text-[11px] text-[#8a847b]">
                  Defined in <code className="font-mono">sanity/lib/queries.ts</code> using <code className="font-mono">next-sanity</code>.
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#716c65] uppercase tracking-wider">
                    Query Result (JSON)
                  </label>
                  {queryResult && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(queryResult, "result")}
                      className="text-xs text-[#716c65] hover:text-[#171614] flex items-center gap-1"
                    >
                      {copied === "result" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied === "result" ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>
                <pre className="p-4 bg-[#f7f5f0] border border-[#ded9d0] text-[#171614] font-mono text-xs rounded-2xl h-[175px] overflow-y-auto">
                  {queryResult || "// Click 'Run Query' to execute GROQ request..."}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Schema Definition */}
        {activeTab === "schema" && (
          <div className="bg-[#fffefa] border border-[#ded9d0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded9d0]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#171614]">Sofa Product Schema</h3>
                <p className="text-xs text-[#716c65]">
                  Location: <code className="font-mono text-[#171614]">sanity/schemaTypes/productType.ts</code>
                </p>
              </div>
              <span className="text-xs font-mono text-[#8a847b]">Type: document</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">name & slug</strong>
                <p className="text-[#716c65]">String title and unique URL slug (e.g. <code className="font-mono">cloud-01</code>).</p>
              </div>
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">price & priceNum</strong>
                <p className="text-[#716c65]">Formatted currency text (₹78,000) and integer for cart calculations.</p>
              </div>
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">dimensions</strong>
                <p className="text-[#716c65]">Architectural sizing specs (Width × Depth × Height).</p>
              </div>
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">configurations</strong>
                <p className="text-[#716c65]">Array of tags: 2 Seater, 3 Seater, L-Shape, Chaise, Modular.</p>
              </div>
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">fabrics & colors</strong>
                <p className="text-[#716c65]">Tactile textiles (Belgian Linen, Bouclé) and curated shades.</p>
              </div>
              <div className="p-4 bg-[#f7f5f0] border border-[#ded9d0] rounded-2xl space-y-1">
                <strong className="text-[#171614] block">mainImage & gallery</strong>
                <p className="text-[#716c65]">Sanity image assets with hotspot framing and CDN delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Seed Dataset */}
        {activeTab === "seed" && (
          <div className="bg-[#fffefa] border border-[#ded9d0] p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded9d0]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#171614]">Sofa Dataset Seed (NDJSON)</h3>
                <p className="text-xs text-[#716c65]">
                  Import all 6 Cloud Sofa models into your Sanity dataset with one command using Sanity CLI.
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(ndjsonSeed, "ndjson")}
                className="px-4 py-2 bg-[#211d19] hover:bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1.5"
              >
                {copied === "ndjson" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === "ndjson" ? "Copied NDJSON" : "Copy Seed Data"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#716c65] uppercase tracking-wider block">
                How to import into Sanity:
              </label>
              <pre className="p-3 bg-[#211d19] text-neutral-200 rounded-xl text-xs font-mono">
                {`# 1. Save data to seed.ndjson\n# 2. Run Sanity import:\nnpx sanity dataset import seed.ndjson production`}
              </pre>
            </div>

            <pre className="p-4 bg-[#f7f5f0] border border-[#ded9d0] text-[#171614] font-mono text-xs rounded-2xl max-h-60 overflow-y-auto">
              {ndjsonSeed}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

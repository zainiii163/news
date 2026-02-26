"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { useAuth } from "@/providers/AuthProvider";
import { tokenStorage } from "@/lib/helpers/storage";

interface ProlocoRequest {
  id: string;
  ts: number;
  city: string;
  proloco: string;
  president: string;
  presidentTel: string;
  presidentMail: string;
  refMail: string;
  tel: string;
  website?: string;
  note?: string;
}

export default function ProlocoAuth() {
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [statusText, setStatusText] = useState("Non autenticato");
  const [loginMode, setLoginMode] = useState<"email" | "code">("email"); // "email" for approved users, "code" for pending

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    city: "",
    prolocoCode: "",
    password: "",
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    prolocoName: "",
    president: "",
    presidentTel: "",
    presidentMail: "",
    refMail: "",
    tel: "",
    website: "",
    note: "",
  });

  const [requests, setRequests] = useState<ProlocoRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved requests from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("proloco_demo_requests_v1");
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading requests:", e);
      }
    }
  }, []);

  // Save requests to localStorage
  const saveRequests = (newRequests: ProlocoRequest[]) => {
    localStorage.setItem("proloco_demo_requests_v1", JSON.stringify(newRequests));
    setRequests(newRequests);
  };

  // Handle Pro Loco registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Le password non corrispondono");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword: _confirmPassword, ...registerData } = registerForm;
      await axios.post(`${API_CONFIG.BASE_URL}/auth/proloco/register`, registerData);

      setSuccess("Richiesta di registrazione inviata! Attendi l'approvazione dell'amministratore.");
      
      // Save to demo requests
      const newRequest: ProlocoRequest = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        ts: Date.now(),
        city: registerForm.city,
        proloco: registerForm.prolocoName,
        president: registerForm.president,
        presidentTel: registerForm.presidentTel,
        presidentMail: registerForm.presidentMail,
        refMail: registerForm.refMail,
        tel: registerForm.tel,
        website: registerForm.website,
        note: registerForm.note,
      };
      saveRequests([...requests, newRequest]);

      // Clear form
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: "",
        prolocoName: "",
        president: "",
        presidentTel: "",
        presidentMail: "",
        refMail: "",
        tel: "",
        website: "",
        note: "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  // Handle Pro Loco login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      interface LoginData {
        password: string;
        email?: string;
        city?: string;
        prolocoCode?: string;
      }
      const loginData: LoginData = { password: loginForm.password };
      
      // Validate based on login mode
      if (loginMode === "email") {
        if (!loginForm.email || !loginForm.password) {
          setError("Inserisci email e password");
          setLoading(false);
          return;
        }
        loginData.email = loginForm.email;
      } else {
        // loginMode === "code"
        if (!loginForm.city || !loginForm.prolocoCode || !loginForm.password) {
          setError("Inserisci città, codice Pro Loco e password");
          setLoading(false);
          return;
        }
        loginData.city = loginForm.city;
        loginData.prolocoCode = loginForm.prolocoCode;
      }

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/proloco/login`, loginData);

      // Use main auth system for proper integration
      const token = response.data.data.token;
      const user = response.data.data.user;
      
      // Store token using main auth system
      tokenStorage.set(token);
      authLogin(token, user);
      
      setIsAuthenticated(true);
      setStatusText(`Autenticato: ${user.prolocoCity || ""} • ${user.name}`);
      
      // Redirect to Pro Loco dashboard - use window.location to ensure proper redirect
      window.location.href = "/proloco/dashboard";
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  // Fill demo data for login
  const fillDemoLogin = () => {
    setLoginMode("email"); // Use email mode for approved users
    setLoginForm({
      email: "proloco.catanzaro@demo.it",
      city: "",
      prolocoCode: "",
      password: "proloco",
    });
  };

  // Fill demo data for registration
  const fillDemoRegister = () => {
    setRegisterForm({
      ...registerForm,
      city: "Soverato",
      prolocoName: "Pro Loco Soverato APS",
      president: "Giuseppe Bianchi",
      presidentTel: "+39 333 123 4567",
      presidentMail: "presidente@prolocosoverato.it",
      refMail: "info@prolocosoverato.it",
      tel: "+39 0967 000000",
      website: "@prolocosoverato",
      note: "Richiediamo accesso per inviare eventi, comunicati e foto con allegati.",
    });
  };

  // Delete request
  const deleteRequest = (id: string) => {
    saveRequests(requests.filter((r) => r.id !== id));
  };

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `
        radial-gradient(900px 520px at 20% 0%, rgba(0,229,255,.40), transparent 60%),
        radial-gradient(900px 700px at 95% 10%, rgba(45,124,255,.38), transparent 60%),
        linear-gradient(180deg, #061025 0%, #06283a 55%, #02111f 100%)
      `
    }}>
      {/* Background photo */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(0,229,255,.20), rgba(0,0,0,.65) 55%, rgba(0,0,0,.76)),
            url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=70')
          `,
          filter: 'saturate(1.25) contrast(1.12)',
          transform: 'scale(1.02)',
          zIndex: -2
        }}
        aria-hidden="true"
      />
      
      {/* Sea gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(900px 500px at 30% 25%, rgba(0,229,255,.38), transparent 60%),
            radial-gradient(1100px 600px at 70% 30%, rgba(45,124,255,.30), transparent 60%),
            linear-gradient(180deg, rgba(0,229,255,.10), rgba(0,0,0,0))
          `,
          zIndex: -1
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 px-4 pt-5 pb-2 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#001018] font-black text-sm tracking-wide" style={{
              background: 'linear-gradient(135deg, rgba(0,229,255,.98), rgba(45,124,255,.98))',
              boxShadow: '0 14px 40px rgba(0,229,255,.18)'
            }}>
              PL
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-white m-0">Area Pro Loco • Accesso & Registrazione</h1>
              <p className="text-xs text-white/70 mt-0.5 mb-0">Sfondo mare azzurro + montagne • colori OptyShop</p>
            </div>
          </div>
          <div className="flex gap-2 items-center px-3 py-2.5 rounded-full border border-white/14 bg-[rgba(9,18,45,.55)] backdrop-blur-[10px] text-xs text-white/70">
            <span>🔒</span>
            <span>{statusText}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 pb-10 pt-2.5">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap p-2.5 rounded-full border border-white/14 bg-[rgba(9,18,45,.52)] backdrop-blur-[10px] w-fit mb-3.5">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-3 py-2.5 rounded-full font-extrabold text-xs cursor-pointer select-none transition-all ${
              activeTab === "login"
                ? "bg-gradient-to-br from-[rgba(0,229,255,.95)] to-[rgba(45,124,255,.95)] text-[#001018] border-0"
                : "border border-white/12 bg-white/6 text-white/70 border border-white/12"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-3 py-2.5 rounded-full font-extrabold text-xs cursor-pointer select-none transition-all ${
              activeTab === "register"
                ? "bg-gradient-to-br from-[rgba(0,229,255,.95)] to-[rgba(45,124,255,.95)] text-[#001018] border-0"
                : "border border-white/12 bg-white/6 text-white/70 border border-white/12"
            }`}
          >
            Registrazione Pro Loco
          </button>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr] gap-3.5 max-md:grid-cols-1">
          {/* Login Card */}
          {activeTab === "login" && (
            <div className="border border-white/14 rounded-[18px] bg-[rgba(9,18,45,.72)] backdrop-blur-[10px] shadow-[0_18px_55px_rgba(0,0,0,.45)] overflow-hidden">
              <div className="p-3.5 pb-3 border-b border-white/14 flex items-start justify-between gap-2.5">
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-white m-0">Login Pro Loco</h2>
                  <div className="text-xs text-white/70 mt-1.5 mb-0 leading-[1.35]">Accesso consentito solo agli account Pro Loco (demo locale).</div>
                </div>
                <span className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/14 bg-white/6 text-white/70 whitespace-nowrap">Solo Pro Loco</span>
              </div>
              <div className="p-3.5">
                <form onSubmit={handleLogin}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-none text-sm text-red-200">
                      {error}
                    </div>
                  )}
                  
                  {/* Login Mode Toggle - Show email/password for approved users, city/code for pending */}
                  <div className="mb-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode("email");
                        setLoginForm({ ...loginForm, city: "", prolocoCode: "" });
                      }}
                      className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
                        loginMode === "email"
                          ? "bg-[rgba(0,229,255,.3)] border border-[rgba(0,229,255,.5)] text-white"
                          : "bg-white/8 border border-white/14 text-white/70 hover:bg-white/12"
                      }`}
                    >
                      Email / Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode("code");
                        setLoginForm({ ...loginForm, email: "" });
                      }}
                      className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
                        loginMode === "code"
                          ? "bg-[rgba(0,229,255,.3)] border border-[rgba(0,229,255,.5)] text-white"
                          : "bg-white/8 border border-white/14 text-white/70 hover:bg-white/12"
                      }`}
                    >
                      Città / Codice
                    </button>
                  </div>

                  {loginMode === "email" ? (
                    /* Email/Password Login (for approved Pro Loco users) */
                    <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                      <div>
                        <label htmlFor="email" className="block text-xs text-white/70 mb-1.5">Email / Username</label>
                        <input
                          id="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="proloco@comune.it"
                          className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pass" className="block text-xs text-white/70 mb-1.5">Password</label>
                        <input
                          id="pass"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    /* City/Code Login (for pending Pro Loco users) */
                    <>
                      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                        <div>
                          <label htmlFor="city" className="block text-xs text-white/70 mb-1.5">Città / Comune</label>
                          <input
                            id="city"
                            type="text"
                            value={loginForm.city}
                            onChange={(e) => setLoginForm({ ...loginForm, city: e.target.value })}
                            placeholder="Es. Catanzaro, Soverato, Tropea..."
                            className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                            required={loginMode === "code"}
                          />
                        </div>
                        <div>
                          <label htmlFor="prolocoCode" className="block text-xs text-white/70 mb-1.5">Codice Pro Loco</label>
                          <input
                            id="prolocoCode"
                            type="text"
                            value={loginForm.prolocoCode}
                            onChange={(e) => setLoginForm({ ...loginForm, prolocoCode: e.target.value })}
                            placeholder="Es. PL-XXXX"
                            className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                            required={loginMode === "code"}
                          />
                        </div>
                      </div>
                      <div className="mt-2.5">
                        <label htmlFor="pass" className="block text-xs text-white/70 mb-1.5">Password</label>
                        <input
                          id="pass"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2.5 flex-wrap mt-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer border-0 bg-gradient-to-br from-[rgba(0,229,255,.95)] to-[rgba(45,124,255,.95)] text-[#001018] disabled:opacity-50"
                    >
                      {loading ? "Accesso..." : "Accedi"}
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoLogin}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer bg-white/8 text-white/92 border border-white/14"
                    >
                      Compila demo
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginForm({ email: "", city: "", prolocoCode: "", password: "" })}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer bg-[rgba(251,113,133,.12)] border border-[rgba(251,113,133,.35)] text-[#ffd2da]"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="text-xs text-white/70 mt-2.5 leading-[1.35]">
                    {loginMode === "email" ? (
                      <>
                        ✅ <strong>Demo (Email):</strong> Email <strong>proloco.catanzaro@demo.it</strong> • Password <strong>proloco</strong>
                      </>
                    ) : (
                      <>
                        ✅ <strong>Demo (Codice):</strong> Città <strong>Catanzaro</strong> • Codice <strong>PL-2025</strong> • Password <strong>proloco</strong>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Registration Card */}
          {activeTab === "register" && (
            <div className="border border-white/14 rounded-[18px] bg-[rgba(9,18,45,.72)] backdrop-blur-[10px] shadow-[0_18px_55px_rgba(0,0,0,.45)] overflow-hidden">
              <div className="p-3.5 pb-3 border-b border-white/14 flex items-start justify-between gap-2.5">
                <div>
                  <h2 className="text-sm font-bold tracking-wide text-white m-0">Registrazione Pro Loco</h2>
                  <div className="text-xs text-white/70 mt-1.5 mb-0 leading-[1.35]">Compila i dati (Presidente: tel + mail) per richiedere accesso.</div>
                </div>
                <span className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/14 bg-white/6 text-white/70 whitespace-nowrap">Richiesta accesso</span>
              </div>
              <div className="p-3.5">
                <form onSubmit={handleRegister}>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-none text-sm text-red-200">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-none text-sm text-green-200">
                      {success}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="rCity" className="block text-xs text-white/70 mb-1.5">Città / Comune</label>
                      <input
                        id="rCity"
                        type="text"
                        required
                        value={registerForm.city}
                        onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                        placeholder="Es. Tropea"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="rProlocoName" className="block text-xs text-white/70 mb-1.5">Nome Pro Loco</label>
                      <input
                        id="rProlocoName"
                        type="text"
                        required
                        value={registerForm.prolocoName}
                        onChange={(e) => setRegisterForm({ ...registerForm, prolocoName: e.target.value })}
                        placeholder="Es. Pro Loco Tropea APS"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="registerName" className="block text-xs text-white/70 mb-1.5">Nome operatore</label>
                      <input
                        id="registerName"
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="Es. Mario Rossi"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="registerEmail" className="block text-xs text-white/70 mb-1.5">Email</label>
                      <input
                        id="registerEmail"
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="rPresident" className="block text-xs text-white/70 mb-1.5">Presidente (Nome e Cognome)</label>
                      <input
                        id="rPresident"
                        type="text"
                        required
                        value={registerForm.president}
                        onChange={(e) => setRegisterForm({ ...registerForm, president: e.target.value })}
                        placeholder="Es. Mario Rossi"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="rPresidentTel" className="block text-xs text-white/70 mb-1.5">Tel Presidente</label>
                      <input
                        id="rPresidentTel"
                        type="tel"
                        required
                        value={registerForm.presidentTel}
                        onChange={(e) => setRegisterForm({ ...registerForm, presidentTel: e.target.value })}
                        placeholder="+39 3xx xxx xxxx"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="rPresidentMail" className="block text-xs text-white/70 mb-1.5">Mail Presidente</label>
                      <input
                        id="rPresidentMail"
                        type="email"
                        required
                        value={registerForm.presidentMail}
                        onChange={(e) => setRegisterForm({ ...registerForm, presidentMail: e.target.value })}
                        placeholder="presidente@proloco.it"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="rRefMail" className="block text-xs text-white/70 mb-1.5">Mail riferimento Pro Loco</label>
                      <input
                        id="rRefMail"
                        type="email"
                        required
                        value={registerForm.refMail}
                        onChange={(e) => setRegisterForm({ ...registerForm, refMail: e.target.value })}
                        placeholder="info@proloco.it"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="rTel" className="block text-xs text-white/70 mb-1.5">Telefono Pro Loco</label>
                      <input
                        id="rTel"
                        type="tel"
                        required
                        value={registerForm.tel}
                        onChange={(e) => setRegisterForm({ ...registerForm, tel: e.target.value })}
                        placeholder="+39 0xx xxxxxxx"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="rWebsite" className="block text-xs text-white/70 mb-1.5">Sito / Social (opz.)</label>
                      <input
                        id="rWebsite"
                        type="text"
                        value={registerForm.website}
                        onChange={(e) => setRegisterForm({ ...registerForm, website: e.target.value })}
                        placeholder="https://... / @instagram"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <label htmlFor="rNote" className="block text-xs text-white/70 mb-1.5">Note / messaggio</label>
                    <textarea
                      id="rNote"
                      rows={4}
                      value={registerForm.note}
                      onChange={(e) => setRegisterForm({ ...registerForm, note: e.target.value })}
                      placeholder="Es. Richiediamo accesso per inviare eventi, comunicati e foto..."
                      className="w-full min-h-[110px] resize-y rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 max-sm:grid-cols-1">
                    <div>
                      <label htmlFor="registerPassword" className="block text-xs text-white/70 mb-1.5">Password</label>
                      <input
                        id="registerPassword"
                        type="password"
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="Minimo 6 caratteri"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="registerConfirmPassword" className="block text-xs text-white/70 mb-1.5">Conferma Password</label>
                      <input
                        id="registerConfirmPassword"
                        type="password"
                        required
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        placeholder="Ripeti password"
                        className="w-full rounded-[14px] border border-white/14 bg-[rgba(5,10,22,.55)] text-white/92 px-3 py-3 outline-none focus:border-[rgba(0,229,255,.55)] focus:shadow-[0_0_0_4px_rgba(0,229,255,.10)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 flex-wrap mt-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer border-0 bg-gradient-to-br from-[rgba(0,229,255,.95)] to-[rgba(45,124,255,.95)] text-[#001018] disabled:opacity-50"
                    >
                      {loading ? "Invio..." : "Invia richiesta"}
                    </button>
                    <button
                      type="button"
                      onClick={fillDemoRegister}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer bg-white/8 text-white/92 border border-white/14"
                    >
                      Compila demo
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterForm({
                        name: "", email: "", password: "", confirmPassword: "",
                        city: "", prolocoName: "", president: "", presidentTel: "",
                        presidentMail: "", refMail: "", tel: "", website: "", note: ""
                      })}
                      className="px-3.5 py-3 rounded-[14px] font-black cursor-pointer bg-[rgba(251,113,133,.12)] border border-[rgba(251,113,133,.35)] text-[#ffd2da]"
                    >
                      Svuota
                    </button>
                  </div>

                  <div className="text-xs text-white/70 mt-2.5 leading-[1.35]">
                    🔧 Demo: la richiesta viene salvata nel browser e appare a destra come &quot;Richieste&quot;.
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Requests Sidebar */}
          <aside className="border border-white/14 rounded-[18px] bg-[rgba(9,18,45,.72)] backdrop-blur-[10px] shadow-[0_18px_55px_rgba(0,0,0,.45)] overflow-hidden">
            <div className="p-3.5 pb-3 border-b border-white/14 flex items-start justify-between gap-2.5">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-white m-0">Richieste registrazione (demo)</h2>
                <div className="text-xs text-white/70 mt-1.5 mb-0 leading-[1.35]">In reale: backend + approvazione admin.</div>
              </div>
              <span className="text-[11px] px-2.5 py-1.5 rounded-full border border-white/14 bg-white/6 text-white/70 whitespace-nowrap">{requests.length}</span>
            </div>
            <div className="p-3.5">
              <div className="flex flex-col gap-2.5">
                {requests.length === 0 ? (
                  <div className="p-3 rounded-2xl border border-white/12 bg-[rgba(5,10,22,.38)]">
                    <div className="text-xs text-white/70">Nessuna richiesta registrazione.</div>
                  </div>
                ) : (
                  requests.sort((a, b) => (b.ts || 0) - (a.ts || 0)).map((req) => (
                    <div key={req.id} className="p-3 rounded-2xl border border-white/12 bg-[rgba(5,10,22,.38)]">
                      <div className="flex items-center justify-between gap-2.5 mb-1.5">
                        <div className="font-extrabold text-[13px] flex gap-2 items-center flex-wrap text-white">
                          <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_0_4px_rgba(0,229,255,.12)]"></span>
                          {req.city} • {req.proloco}
                        </div>
                        <div className="text-xs text-white/70">{new Date(req.ts).toLocaleString("it-IT")}</div>
                      </div>
                      <div className="text-xs text-white/70 mb-1.5">
                        <strong>Presidente:</strong> {req.president} • {req.presidentTel} • {req.presidentMail}
                      </div>
                      <div className="text-xs text-white/70 mb-1.5">
                        <strong>Contatti:</strong> {req.tel} • {req.refMail} • {req.website || "—"}
                      </div>
                      <div className="text-xs text-white/82 leading-[1.45] mb-2.5">
                        <strong>Nota:</strong> {req.note || "—"}
                      </div>
                      <div className="flex gap-2.5 flex-wrap mt-2.5">
                        <button
                          onClick={() => deleteRequest(req.id)}
                          className="px-3 py-2 rounded-[14px] font-black cursor-pointer bg-[rgba(251,113,133,.12)] border border-[rgba(251,113,133,.35)] text-[#ffd2da] text-xs"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="text-[11px] text-white/70 mt-2 leading-[1.35]">
                Backend consigliato: stato richiesta <strong>in_attesa/approvata/respinta</strong>.
              </div>
            </div>
          </aside>
        </div>

        <div className="max-w-[1100px] mx-auto px-4 pb-7 mt-4 text-white/70 text-xs">
          🔧 Flusso: Registrazione → approvazione admin → credenziali → Login → segnalazioni.
        </div>
      </main>
    </div>
  );
}


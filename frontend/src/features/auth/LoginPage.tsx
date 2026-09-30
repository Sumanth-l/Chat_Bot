import { useState, type FormEvent } from 'react';
import { authApi } from '../../services/authApi';
import type { ChatUser } from '../../types/chat';

export type LoginUser = ChatUser;

export interface LoginPageProps {
  onLoginSuccess?: (user: LoginUser) => void;
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 0 60.7 35.2 91 18 73.8 48.3 100 50 73.8 60.7 91 91 60.7 73.8 50 100 39.3 73.8 9 91 26.2 60.7 0 50 26.2 39.3 9 9 39.3 26.2Z" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signedInUser, setSignedInUser] = useState<LoginUser | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { user } = await authApi.login({ email: email.trim(), password });
      setSignedInUser(user);
      onLoginSuccess?.(user);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'We couldn’t sign you in. Check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[length:36px_36px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_25%,#F8FAFC_100%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-8">
        <header className="page-enter flex items-center justify-between border-b-2 border-[#111827] pb-4">
          <a href="/" aria-label="Dialog home" className="group inline-flex items-center gap-2.5 font-black tracking-[-0.06em]">
            <span className="grid h-8 w-8 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white transition-transform group-hover:-rotate-6">
              <Sparkle className="h-[18px] w-[18px]" />
            </span>
            <span className="text-xl">dialog<span className="text-[#2563EB]">.</span></span>
          </a>
          <p className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:block">Your ideas, in motion</p>
          <span className="border-2 border-[#111827] bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] sm:hidden">AI workspace</span>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)] lg:gap-16 lg:py-16 xl:gap-24">
          <section aria-labelledby="hero-title" className="page-enter relative mx-auto w-full max-w-[680px] lg:mx-0">
            <div className="mb-7 inline-flex items-center gap-2 border-2 border-[#111827] bg-white px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] shadow-[3px_3px_0_#111827] sm:mb-9">
              <span className="h-2 w-2 bg-[#2563EB]" />
              The AI workspace for what’s next
            </div>

            <h1 id="hero-title" className="max-w-[760px] text-[clamp(3.4rem,10vw,7.9rem)] font-black uppercase leading-[0.82] tracking-[-0.085em]">
              <span className="block">Chat</span>
              <span className="block">smarter<span className="text-[#2563EB]">.</span></span>
              <span className="mt-2 block text-[0.79em]">Build faster<span className="text-[#2563EB]">.</span></span>
            </h1>

            <div className="mt-8 flex max-w-[490px] gap-4 border-l-[5px] border-[#2563EB] pl-4 sm:mt-10 sm:pl-5">
              <p className="text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Turn big questions into clear next steps. Meet the thinking partner built to keep your momentum moving.
              </p>
            </div>

            <div className="relative mt-10 h-[154px] max-w-[520px] sm:mt-12 sm:h-[180px]" aria-hidden="true">
              <div className="absolute left-[4%] top-5 h-20 w-20 rotate-[-11deg] border-2 border-[#111827] bg-[#2563EB] shadow-[6px_6px_0_#111827] transition-transform duration-300 hover:rotate-[-16deg] sm:h-24 sm:w-24" />
              <div className="absolute left-[30%] top-12 h-[68px] w-[68px] rotate-[14deg] border-2 border-[#111827] bg-[#F8FAFC] sm:left-[28%] sm:h-20 sm:w-20">
                <span className="absolute inset-0 m-auto h-8 w-8 rotate-45 border-2 border-[#111827] bg-[#F8FAFC]" />
              </div>
              <Sparkle className="absolute left-[55%] top-2 h-[76px] w-[76px] rotate-[-8deg] text-[#2563EB] transition-transform duration-300 hover:rotate-12 sm:left-[53%] sm:h-[94px] sm:w-[94px]" />
              <div className="absolute bottom-2 right-[3%] w-[142px] rotate-[7deg] border-2 border-[#111827] bg-white px-3 py-2.5 shadow-[4px_4px_0_#111827] sm:right-[7%] sm:w-[168px] sm:px-4 sm:py-3">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500">A little more</p>
                <p className="mt-1 text-sm font-black uppercase tracking-[-0.04em] sm:text-base">Done by design <span className="text-[#2563EB]">↗</span></p>
              </div>
              <div className="absolute bottom-1 left-[3%] h-[3px] w-[20%] bg-[#111827]" />
            </div>

            <div className="mt-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">
              <span className="h-px w-8 bg-slate-400" />
              Think clearly. Move confidently.
            </div>
          </section>

          <section aria-labelledby="login-title" className="page-enter-delayed mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
            <div className="relative border-2 border-[#111827] bg-white p-6 shadow-[7px_7px_0_#111827] sm:p-9 md:p-10">
              <div aria-hidden="true" className="absolute -right-2 -top-2 h-5 w-5 border-2 border-[#111827] bg-[#2563EB]" />
              {signedInUser ? (
                <div className="py-9" role="status" aria-live="polite">
                  <span className="grid h-14 w-14 place-items-center border-2 border-[#111827] bg-[#2563EB] text-2xl font-black text-white">✓</span>
                  <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2563EB]">You’re in</p>
                  <h2 className="mt-2 text-4xl font-black tracking-[-0.07em]">Welcome back.</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Signed in as <span className="font-bold text-[#111827]">{signedInUser.name || signedInUser.email}</span>.</p>
                  <p className="mt-8 border-t-2 border-[#111827] pt-5 text-xs leading-5 text-slate-500">Your secure session is ready. Continue to your workspace from the app navigation.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2563EB]">Welcome back</p>
                      <h2 id="login-title" className="mt-2 text-4xl font-black tracking-[-0.075em] sm:text-[2.65rem]">Sign in<span className="text-[#2563EB]">.</span></h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Pick up where your best ideas left off.</p>
                    </div>
                    <span aria-hidden="true" className="hidden border-2 border-[#111827] bg-[#F8FAFC] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] sm:block">Secure access</span>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em]">Email address</label>
                        <input
                          autoComplete="email"
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@company.com"
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? 'login-error' : undefined}
                          className="h-12 w-full border-2 border-[#111827] bg-[#F8FAFC] px-3.5 text-sm font-medium outline-none transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 hover:bg-white focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label htmlFor="password" className="block text-xs font-extrabold uppercase tracking-[0.12em]">Password</label>
                          <a href="/forgot-password" className="group/link inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] underline decoration-1 underline-offset-4 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">Forgot password? <ArrowUpRight /></a>
                        </div>
                        <input
                          autoComplete="current-password"
                          id="password"
                          name="password"
                          type="password"
                          required
                          minLength={8}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? 'login-error' : undefined}
                          className="h-12 w-full border-2 border-[#111827] bg-[#F8FAFC] px-3.5 text-sm font-medium outline-none transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 hover:bg-white focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                        />
                      </div>
                    </div>

                    {error && (
                      <p id="login-error" role="alert" className="mt-4 border-2 border-red-700 bg-red-50 px-3 py-2.5 text-sm font-semibold leading-5 text-red-800">
                        {error}
                      </p>
                    )}

                    <div className="mt-5 flex items-center">
                      <label htmlFor="remember-me" className="group inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600">
                        <input
                          id="remember-me"
                          name="rememberMe"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          className="h-4 w-4 cursor-pointer accent-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                        />
                        Keep me signed in
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email.trim() || !password}
                      className="mt-7 flex h-[52px] w-full items-center justify-center gap-2 border-2 border-[#111827] bg-[#2563EB] px-5 text-sm font-extrabold uppercase tracking-[0.1em] text-white shadow-[4px_4px_0_#111827] transition-[transform,background-color,box-shadow] duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-700 hover:shadow-[2px_2px_0_#111827] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111827]"
                    >
                      {isSubmitting ? (
                        <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Signing you in</>
                      ) : (
                        <>Sign in <span aria-hidden="true" className="text-lg leading-none">→</span></>
                      )}
                    </button>
                  </form>

                  <div className="my-7 flex items-center gap-3" aria-hidden="true">
                    <span className="h-[2px] flex-1 bg-slate-200" />
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-slate-400">New to dialog?</span>
                    <span className="h-[2px] flex-1 bg-slate-200" />
                  </div>

                  <p className="text-center text-sm font-medium text-slate-600">
                    Make room for your next big idea.{' '}
                    <a href="/register" className="font-extrabold text-[#2563EB] underline decoration-1 underline-offset-4 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]">Create an account</a>
                  </p>

                  <p className="mt-7 border-t-2 border-slate-100 pt-4 text-center text-[10px] font-medium leading-5 text-slate-400">By continuing, you agree to our <a href="/terms" className="underline underline-offset-2 hover:text-slate-600">Terms</a> and <a href="/privacy" className="underline underline-offset-2 hover:text-slate-600">Privacy Policy</a>.</p>
                </>
              )}
            </div>
            <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">Built for curious minds <span className="px-1 text-[#2563EB]">✳</span> Made to move you forward</p>
          </section>
        </div>

        <footer className="page-enter flex flex-col gap-2 border-t-2 border-[#111827] pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Dialog AI</span>
          <span>Good thinking starts here <span className="text-[#2563EB]">↗</span></span>
        </footer>
      </div>
    </main>
  );
}

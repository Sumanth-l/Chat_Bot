import { useState, type FormEvent } from 'react';
import { authApi } from '../../services/authApi';

interface RegisterPageProps {
  onRegistered: () => void;
}

export default function RegisterPage({ onRegistered }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await authApi.register({ name: name.trim(), email: email.trim(), password });
      onRegistered();
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[#F8FAFC] px-5 py-10 text-[#111827]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[length:36px_36px]" />
      <section className="page-enter w-full max-w-[480px] border-2 border-[#111827] bg-white p-6 shadow-[7px_7px_0_#111827] sm:p-10" aria-labelledby="register-heading">
        <a href="/" className="inline-flex items-center gap-2.5 font-black tracking-[-0.06em]" aria-label="Dialog home">
          <span className="grid h-8 w-8 place-items-center border-2 border-[#111827] bg-[#2563EB] text-white">✳</span>
          <span className="text-xl">dialog<span className="text-[#2563EB]">.</span></span>
        </a>
        <p className="mt-9 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#2563EB]">Start with a question</p>
        <h1 id="register-heading" className="mt-2 text-4xl font-black tracking-[-0.075em]">Create your account<span className="text-[#2563EB]">.</span></h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">A clearer place to think, make, and move forward.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="register-name" className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em]">Your name</label>
            <input id="register-name" name="name" autoComplete="name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full border-2 border-[#111827] bg-[#F8FAFC] px-3.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em]">Email address</label>
            <input id="register-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full border-2 border-[#111827] bg-[#F8FAFC] px-3.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em]">Password</label>
            <input id="register-password" name="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full border-2 border-[#111827] bg-[#F8FAFC] px-3.5 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20" />
            <p className="mt-1.5 text-[10px] font-medium text-slate-500">Use at least 8 characters.</p>
          </div>
          {error && <p role="alert" className="border-2 border-red-700 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-800">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="flex h-[52px] w-full items-center justify-center gap-2 border-2 border-[#111827] bg-[#2563EB] px-5 text-sm font-extrabold uppercase tracking-[0.1em] text-white shadow-[4px_4px_0_#111827] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-blue-700 hover:shadow-[2px_2px_0_#111827] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-7 border-t-2 border-slate-100 pt-5 text-center text-sm font-medium text-slate-600">Already have an account? <a href="/login" className="font-extrabold text-[#2563EB] underline underline-offset-4">Sign in</a></p>
      </section>
    </main>
  );
}

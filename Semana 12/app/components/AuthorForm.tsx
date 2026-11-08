"use client";

import { useState, type FormEvent } from "react";
import type { Author } from "@/lib/types";
import { errMsg } from "@/lib/api";

export type AuthorPayload = {
  name: string;
  email: string;
  nationality: string | null;
  birthYear: number | null;
  bio: string | null;
};

export default function AuthorForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Author | null;
  submitLabel: string;
  onSubmit: (data: AuthorPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [nationality, setNationality] = useState(initial?.nationality ?? "");
  const [birthYear, setBirthYear] = useState(initial?.birthYear?.toString() ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOk(false);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        nationality: nationality.trim() || null,
        birthYear: birthYear ? Number(birthYear) : null,
        bio: bio.trim() || null,
      });
      setOk(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="label mb-1.5 block">Nombre *</label>
        <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Gabriel García Márquez" />
      </div>
      <div>
        <label className="label mb-1.5 block">Email *</label>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="autor@example.com" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">Nacionalidad</label>
          <input className="input" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Colombia" />
        </div>
        <div>
          <label className="label mb-1.5 block">Año de nacimiento</label>
          <input className="input" type="number" min={0} max={2100} value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="1927" />
        </div>
      </div>
      <div>
        <label className="label mb-1.5 block">Biografía</label>
        <textarea className="input min-h-24 resize-y" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Breve reseña del autor" />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {ok && !error && <p className="text-sm text-accent">Guardado correctamente.</p>}

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Guardando…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

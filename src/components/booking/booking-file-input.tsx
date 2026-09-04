"use client";

import { Paperclip, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ACCEPTED_FILE_TYPES, ACCEPT_ATTRIBUTE, FILE_HINT, MAX_FILE_BYTES } from "@/lib/booking/config";

const EXTENSIONS = Object.values(ACCEPTED_FILE_TYPES).flat() as string[];

function formatBytes(size: number) {
  return size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;
}

function describe(file: File) {
  const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
  return `${extension} · ${formatBytes(file.size)}`;
}

/**
 * Attachment picker: a click-or-drop target that collapses into a compact
 * summary row once a file is chosen. Client-side checks are for feedback only
 * — the server re-validates size, type and content before sending anything.
 */
export function BookingFileInput({ disabled, serverError }: { disabled?: boolean; serverError?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function accept(candidate: File | undefined) {
    if (!candidate) return;

    const named = EXTENSIONS.some((extension) => candidate.name.toLowerCase().endsWith(extension));
    if (!named) {
      setError("Unsupported format. Attach a PDF, PNG, JPG or TXT file.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(candidate.size)} — the limit is 10 MB.`);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError(null);
    setFile(candidate);
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    accept(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;

    const dropped = event.dataTransfer.files?.[0];
    if (!dropped || !inputRef.current) return;

    // Mirror the drop into the real input so it submits with the form.
    const transfer = new DataTransfer();
    transfer.items.add(dropped);
    inputRef.current.files = transfer.files;
    accept(dropped);
  }

  function clear() {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const message = error ?? serverError;

  return (
    <div className="mt-5">
      <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted" htmlFor="booking-attachment">
        Attach project files <span className="text-strong">(optional)</span>
      </label>

      <input
        ref={inputRef}
        id="booking-attachment"
        name="attachment"
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />

      {file ? (
        <div className="mt-2 flex items-center gap-3 border border-line bg-panel p-3">
          <Paperclip aria-hidden="true" size={15} className="shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{describe(file)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white disabled:opacity-40"
          >
            <X aria-hidden="true" size={15} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="booking-attachment"
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-2 flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-4 py-5 text-center transition-colors duration-300 ${
            dragging ? "border-accent bg-accent/[0.06]" : "border-strong bg-panel/60 hover:border-accent hover:bg-accent/[0.03]"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Paperclip aria-hidden="true" size={14} className="text-accent" />
            Requirements, architecture diagrams, test reports
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{FILE_HINT}</span>
        </label>
      )}

      {message ? (
        <p role="alert" className="mt-2 text-xs leading-5 text-signal-fail">
          {message}
        </p>
      ) : null}
    </div>
  );
}

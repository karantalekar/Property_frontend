"use client";
import React from "react";

export default function OtpInput({
  length = 6,
  onComplete,
  onChange,
}: {
  length?: number;
  onComplete: (val: string) => void;
  onChange?: (val: string) => void;
}) {
  const [values, setValues] = React.useState<string[]>(
    Array(length).fill("")
  );
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const notify = (next: string[]) => {
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length && !next.includes("")) {
      onComplete(joined);
    }
  };

  const handleChange = (i: number, value: string) => {
    // keep only digits
    const raw = value.replace(/\D/g, "");

    // If user pasted or autofill put multiple digits into one input,
    // distribute them starting at index i
    if (raw.length > 1) {
      const next = [...values];
      for (let k = 0; k < raw.length && i + k < length; k++) {
        next[i + k] = raw[k];
      }
      setValues(next);
      notify(next);
      // focus the first empty or last input
      const firstEmpty = next.findIndex((ch) => ch === "");
      if (firstEmpty === -1) {
        inputsRef.current[length - 1]?.focus();
      } else {
        inputsRef.current[firstEmpty]?.focus();
      }
      return;
    }

    // normal single-character input
    const v = raw.slice(-1); // either "" or one digit
    const next = [...values];
    next[i] = v;
    setValues(next);
    notify(next);

    if (v && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
      // select content of next input (helpful on some platforms)
      inputsRef.current[i + 1]?.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[i]) {
        // clear current cell
        next[i] = "";
        setValues(next);
        onChange?.(next.join(""));
        inputsRef.current[i]?.focus();
      } else if (i > 0) {
        // move back and clear previous
        next[i - 1] = "";
        setValues(next);
        onChange?.(next.join(""));
        inputsRef.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number
  ) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;

    const next = [...values];
    for (let k = 0; k < paste.length && i + k < length; k++) {
      next[i + k] = paste[k];
    }
    setValues(next);
    notify(next);

    const firstEmpty = next.findIndex((ch) => ch === "");
    if (firstEmpty === -1) {
      inputsRef.current[length - 1]?.focus();
    } else {
      inputsRef.current[firstEmpty]?.focus();
    }
  };

  const handleFocus = (i: number) => {
    // select the input contents so typing replaces it
    inputsRef.current[i]?.select();
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          onFocus={() => handleFocus(i)}
          maxLength={1}
          inputMode="numeric"
          autoComplete="one-time-code"
          type="text"
          aria-label={`OTP digit ${i + 1}`}
          className="w-12 h-12 text-center border rounded text-lg transition text-gray-900
            focus:outline-none focus:ring-1 focus:ring-[var(--primaryColor)]
            focus:border-[var(--primaryColor)]"
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { moneyToInputText, parseMoney } from "@/lib/money";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * A price field that accepts a comma or a dot as the decimal separator
 * ("1250,50"), unlike <input type="number"> whose behaviour depends on the
 * browser's language. It keeps what the person typed while they type, only
 * reports valid amounts upward, and tidies the text on blur ("1250,5" → "1250,50").
 */
export function MoneyInput({ value, onChange, className, "aria-label": ariaLabel }: MoneyInputProps) {
  const [text, setText] = useState(() => moneyToInputText(value));
  const [invalid, setInvalid] = useState(false);
  const lastEmitted = useRef(value);

  // Follow outside changes (another price recalculated, a different item opened),
  // but never overwrite what the person is in the middle of typing.
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(moneyToInputText(value));
      setInvalid(false);
    }
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      value={text}
      placeholder="0,00"
      onChange={(e) => {
        const next = e.target.value;
        setText(next);
        const parsed = parseMoney(next);
        if (parsed === null) {
          setInvalid(true);
          return;
        }
        setInvalid(false);
        lastEmitted.current = parsed;
        onChange(parsed);
      }}
      onBlur={() => {
        // Settle on the last valid amount (drops stray characters, formats the cents).
        setText(moneyToInputText(lastEmitted.current));
        setInvalid(false);
      }}
      onFocus={(e) => e.currentTarget.select()}
      className={`${className ?? ""} ${invalid ? "border-red-400 focus-visible:ring-red-400/40" : ""}`.trim()}
    />
  );
}

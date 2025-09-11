import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

interface NumericInputProps {
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  id?: string;
}

export function NumericInput({ value, onChange, placeholder, id }: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === null || value === undefined || value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = e.target.value;

    if (textValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    if (/^[0-9]*[.,]?[0-9]*$/.test(textValue)) {
      setDisplayValue(textValue);

      const numericValue = parseFloat(textValue.replace(',', '.')) || 0;
      onChange(numericValue);
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(displayValue.replace(',', '.')) || 0;
    setDisplayValue(numericValue === 0 ? '' : String(numericValue));
    onChange(numericValue);
  };

  return (
    <Input
      id={id}
      placeholder={placeholder}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="decimal"
    />
  );
}
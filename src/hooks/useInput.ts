'use client';

import { useState, ChangeEvent } from 'react';

export default function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  function onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  return [value, onChange, setValue] as const;
}

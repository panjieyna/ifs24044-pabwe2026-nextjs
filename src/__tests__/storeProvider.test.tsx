import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StoreProvider from '@/store/StoreProvider';
import { useAppSelector } from '@/hooks/redux';

function Probe() {
  const isAuthLogin = useAppSelector((s) => s.auth.isAuthLogin);
  return <p>login: {String(isAuthLogin)}</p>;
}

describe('StoreProvider', () => {
  it('menyediakan store ke children dan tetap sama saat rerender', () => {
    const { rerender } = render(
      <StoreProvider>
        <Probe />
      </StoreProvider>
    );
    expect(screen.getByText('login: false')).toBeInTheDocument();
    rerender(
      <StoreProvider>
        <Probe />
      </StoreProvider>
    );
    expect(screen.getByText('login: false')).toBeInTheDocument();
  });
});

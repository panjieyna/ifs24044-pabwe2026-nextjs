import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import { makeStore } from '@/store';

export function renderWithStore(ui: ReactElement, setup?: (store: ReturnType<typeof makeStore>) => void) {
  const store = makeStore();
  if (setup) setup(store);
  const utils = render(<Provider store={store}>{ui}</Provider>);
  return { store, ...utils };
}

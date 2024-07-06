import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LandingPage from "./LandingPage";
import { HashRouter } from 'react-router-dom'
import { SettingsContext } from '../../utils';
import type { Settings } from '../../utils/types';

test('LandingPage rendering correctly', async () => {
  const mockSettings = { nickname: "MockName" } as Settings;
  render(<>
    <SettingsContext.Provider value={ mockSettings }>
      <LandingPage />
    </SettingsContext.Provider>
  </>, { wrapper: HashRouter });

  // verify page content
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Play/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Settings/ })).toBeInTheDocument();
  
  // verify user nickname display
  expect(screen.getByText(/MockName/i)).toBeInTheDocument();
});

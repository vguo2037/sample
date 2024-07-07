import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GlobalStyleWrapper from './GlobalStyleWrapper'
import { SettingsContext } from '../../utils';
import type { Settings } from '../../utils/types';

describe('GlobalStyleWrapper renders correctly', () => {
  test("During light mode", async () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: false } as Settings}>
        <GlobalStyleWrapper>
          <span>children text</span>
        </GlobalStyleWrapper>
      </SettingsContext.Provider>
    </>);

    const globalStyleWrapper = screen.getByText("children text").parentElement;
    expect(globalStyleWrapper).toHaveClass("bg-light");
    expect(globalStyleWrapper).toHaveClass("text-dark");
  });
  test("During dark mode", async () => {
    render(<>
      <SettingsContext.Provider value={{ darkMode: true } as Settings}>
        <GlobalStyleWrapper>
          <span>children text</span>
        </GlobalStyleWrapper>
      </SettingsContext.Provider>
    </>);

    const globalStyleWrapper = screen.getByText("children text").parentElement;
    expect(globalStyleWrapper).toHaveClass("bg-dark");
    expect(globalStyleWrapper).toHaveClass("text-light");
  });
});

test('GlobalStyleWrapper responds to styleOverride correctly', () => {
  render(<>
    <SettingsContext.Provider value={{ darkMode: false } as Settings}>
      <GlobalStyleWrapper override={{ darkMode: true }}>
        <span>children text</span>
      </GlobalStyleWrapper>
    </SettingsContext.Provider>
  </>);

  const globalStyleWrapper = screen.getByText("children text").parentElement;
  expect(globalStyleWrapper).toHaveClass("bg-dark");
  expect(globalStyleWrapper).toHaveClass("text-light");
});

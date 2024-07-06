import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'

test('App rendering & navigating correctly', async () => {
  render(<App />)
  const user = userEvent.setup()

  const testOneNavAttempt = async (clickedText: RegExp, expectedText: RegExp) => {
    const navButton = screen.getByRole('button', { name: clickedText });
    await user.click(navButton);
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  };

  // verify page content for default route (LandingPage)
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument()

  // verify page navigation to & from SettingsPage, starting from LandingPage
  await testOneNavAttempt(/Settings/, /Settings/);
  await testOneNavAttempt(/Back/, /Welcome/);
  await testOneNavAttempt(/Settings/, /Settings/);
  await testOneNavAttempt(/Save/, /Welcome/);

  // verify page navigation from LandingPage to GamePage
  await testOneNavAttempt(/Play$/, /current score/);

  // verify page navigation to & from SettingsPage, starting from GamePage
  await testOneNavAttempt(/Settings/, /Settings/);
  await testOneNavAttempt(/Back/, /current score/);
  await testOneNavAttempt(/Settings/, /Settings/);
  await testOneNavAttempt(/Save/, /current score/);

  // verify page navigation from GamePage to LandingPage
  await testOneNavAttempt(/Home/, /Welcome/);
});

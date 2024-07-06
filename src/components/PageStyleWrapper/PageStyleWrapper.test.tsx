import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PageStyleWrapper from './PageStyleWrapper'

test('PageStyleWrapper renders correctly', async () => {
  render(<>
    <PageStyleWrapper>
      <span>children text</span>
    </PageStyleWrapper>
  </>);

  expect(screen.getByText("children text")).toBeInTheDocument();
});

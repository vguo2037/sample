import React from "react";
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import PageStyleWrapper from "./PageStyleWrapper"

test("PageStyleWrapper renders correctly", () => {
  render(<>
    <PageStyleWrapper>
      <span>children text</span>
    </PageStyleWrapper>
  </>);

  expect(screen.getByText("children text")).toBeInTheDocument();
});

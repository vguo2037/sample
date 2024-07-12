import React from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Toggle from "./Toggle"

const onToggleChange = jest.fn();

test("Toggle renders correctly", () => {
  render(<Toggle id="mock" onChange={onToggleChange} />);
  const toggle = screen.getByTestId("toggle-mock");
  expect(toggle).toBeInTheDocument();
});

test("Toggle respond to checked changes correctly", async () => {
  render(<Toggle id="mock" onChange={onToggleChange} />);
  const toggle = screen.getByTestId("toggle-mock");

  expect(toggle).toHaveProperty("checked", false);
  expect(onToggleChange).toHaveBeenCalledTimes(0);
  
  await act(async () => {
    toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  
  expect(toggle).toHaveProperty("checked", true);
  expect(onToggleChange).toHaveBeenCalledTimes(1);
});

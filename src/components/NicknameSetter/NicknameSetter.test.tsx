import React, { useState } from "react";
import { act, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import NicknameSetter from "./NicknameSetter"
import { requestRandomNicknames } from "../../utils/nicknameAPI";

jest.mock("../../utils/nicknameAPI", () => ({
  requestRandomNicknames: jest.fn()
}));

beforeEach(() => {
  (requestRandomNicknames as jest.Mock).mockResolvedValue(["MockNickname"])
});

const TestRender = () => {
  const [newNickname, setNewNickname] = useState<string>("");
  return <NicknameSetter newNickname={newNickname} setNewNickname={setNewNickname} />;
};

test("NicknameSetter renders correctly", () => {
  render(<TestRender />);

  expect(screen.getByTestId("form-nickname")).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeInTheDocument();
});

test("NicknameSetter changes value based on randomiser correctly", async () => {
  render(<TestRender />);

  const randomButton = screen.getByRole("button");
  await act(async () => {
    randomButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  
  const inputBox = screen.getByTestId("form-nickname");
  expect(inputBox).toHaveProperty("value", "MockNickname");
});

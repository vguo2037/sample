import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SettingsPage from "./SettingsPage";
import { HashRouter } from 'react-router-dom'
import { SettingsContext, useSettingsValues } from '../../utils';
import type { Settings, StyleOverride } from '../../utils/types';
import { useEffect, useState } from 'react';
import userEvent from '@testing-library/user-event';
import { defaultSettingsValues } from '../../utils/contexts/settings';

type ValueBroadcaster = (currentValue: any) => {};
const broadcastStyleOverride: ValueBroadcaster = jest.fn() as ValueBroadcaster;
const broadcastSettings: ValueBroadcaster = jest.fn() as ValueBroadcaster;

const updatedMockSettings = {
  darkMode: true,
  nickname: "MockTypedNickname",
  playerPlayAs: "O",
  boardSize: 5
} as Settings;

const TestRender = ({ broadcastStyleOverride }: {
  broadcastStyleOverride: ValueBroadcaster
}) => {
  const [globalStyleOverride, setGlobalStyleOverride] = useState<StyleOverride>(undefined);
  
  const settingsContext = useSettingsValues(defaultSettingsValues);

  useEffect(() => {
    broadcastSettings(settingsContext);
  }, [settingsContext]);

  useEffect(() => {
    if (globalStyleOverride !== undefined) broadcastStyleOverride(globalStyleOverride);
  }, [globalStyleOverride]);

  return (<>
    <SettingsContext.Provider value={ settingsContext }>
      <SettingsPage setGlobalStyleOverride={setGlobalStyleOverride} />
    </SettingsContext.Provider>
  </>);
};

test("SettingsPage renders correctly", async () => {
  render(
    <TestRender broadcastStyleOverride={broadcastStyleOverride} />,
    { wrapper: HashRouter }
  );
  expect(screen.getByTestId("form-nickname")).toBeInTheDocument();
  expect(screen.getByTestId("form-playerMark")).toBeInTheDocument();
  expect(screen.getByTestId("form-boardSize")).toBeInTheDocument();
  expect(screen.getByTestId("form-darkMode")).toBeInTheDocument();
});

test("SettingsPage overrides global styling correctly", async () => {
  render(
    <TestRender broadcastStyleOverride={broadcastStyleOverride} />,
    { wrapper: HashRouter }
  );
  // initial render when newDarkMode is updated to current darkMode
  expect(broadcastStyleOverride).toHaveBeenCalledTimes(1);
  expect(broadcastStyleOverride).toHaveBeenLastCalledWith(
    expect.objectContaining({ "darkMode": false })
  );
  
  const darkModeToggle = screen.getByTestId("toggle-input-dark-mode");
  act(() => {
    darkModeToggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  // newDarkMode is updated to !(current darkMode)
  expect(broadcastStyleOverride).toHaveBeenCalledTimes(2);
  expect(broadcastStyleOverride).toHaveBeenLastCalledWith(
    expect.objectContaining({ "darkMode": true })
  );
});

describe("SettingsPage handles context values correctly", () => {
  const user = userEvent.setup();
  let inputNickname: HTMLInputElement;
  let playerMarkOptions: HTMLInputElement[];
  let boardSizeOptions: HTMLInputElement[];
  let darkModeToggle: HTMLInputElement;
  beforeEach(() => {
    act(() => {
      render(
        <TestRender broadcastStyleOverride={broadcastStyleOverride} />,
        { wrapper: HashRouter }
      );
    });
    (broadcastSettings as jest.Mock).mockClear();

    inputNickname = screen.getByTestId("form-nickname");
    
    const formPlayerMark = screen.getByTestId("form-playerMark");
    playerMarkOptions = Array.from(formPlayerMark.getElementsByTagName("input"));
    
    const formBoardSize = screen.getByTestId("form-boardSize");
    boardSizeOptions = Array.from(formBoardSize.getElementsByTagName("input"));

    const formDarkMode = screen.getByTestId("form-darkMode");
    darkModeToggle = formDarkMode.getElementsByTagName("input")[0];
  });

  // assert original settings to be initialMockSettings
  test("Renders original context values upon initial page load", async () => {
    expect(inputNickname).toHaveProperty("value", "Player");

    for (const o of playerMarkOptions) {
      if (o.value === "X") {
        expect(o).toHaveProperty("checked", true);
      } else {
        expect(o).toHaveProperty("checked", false);
      };
    };

    for (const o of boardSizeOptions) {
      if (Number.parseInt(o.value) === 3) {
        expect(o).toHaveProperty("checked", true);
      } else {
        expect(o).toHaveProperty("checked", false);
      };
    };

    expect(darkModeToggle).toHaveProperty("checked", false);
  });
  describe("When values are edited", () => {
    beforeEach(async () => {
      await act(async () => {
        await user.clear(inputNickname);
        await user.type(inputNickname, updatedMockSettings.nickname);

        for (const o of playerMarkOptions) {
          if (o.value === updatedMockSettings.playerPlayAs) await user.click(o);
        };

        for (const o of boardSizeOptions) {
          if (Number.parseInt(o.value) === updatedMockSettings.boardSize) await user.click(o);
        };

        await user.click(darkModeToggle);
      });
    })

    test("Renders correct updated values", () => {
      expect(inputNickname).toHaveProperty("value", "MockTypedNickname");

      for (const o of playerMarkOptions) {
        if (o.value === "O") {
          expect(o).toHaveProperty("checked", true);
        } else {
          expect(o).toHaveProperty("checked", false);
        };
      };
  
      for (const o of boardSizeOptions) {
        if (Number.parseInt(o.value) === 5) {
          expect(o).toHaveProperty("checked", true);
        } else {
          expect(o).toHaveProperty("checked", false);
        };
      };
  
      expect(darkModeToggle).toHaveProperty("checked", true);
    });

    test("Saves context values when Save is clicked", async () => {
      expect(broadcastSettings).toHaveBeenCalledTimes(1); // once for initial load

      const saveButton = screen.getByRole('button', { name: "Save" });
      await act(async () => { await user.click(saveButton); });
      expect(broadcastSettings).toHaveBeenCalledTimes(2);
      expect(broadcastSettings).toHaveBeenLastCalledWith(
        expect.objectContaining(updatedMockSettings)
      )
    });

    test("Discards updates when Back is clicked", async () => {
      expect(broadcastSettings).toHaveBeenCalledTimes(1); // once for initial load

      const backButton = screen.getByRole('button', { name: "Back" });
      await act(async () => { await user.click(backButton); });
      expect(broadcastSettings).toHaveBeenCalledTimes(1);
    });
  });
});

// Button.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // I use the userEvent package to manage events rather than fireEvent
import "@testing-library/jest-dom/extend-expect";
import { Layout,Avatar, Menu, Dropdown , Form, Input, Button ,List,Tabs,Select,Row,Col,Switch,Radio ,message} from "antd";
import dashboard from "../src/Dashboard/Dashboard"
describe("Button Component", () => {
  it("Renders the Button as expected and clicking on it calls the function passed in the onClick prop", () => {
    const onClickMock = jest.fn();
    const { container, debug } = render(
      <Button name="test-btn" onClick={onClickMock}>
        Test
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument(); // .toBeInTheDocument is a handy function that is given by the jest-dom/extend-expect package
    expect(screen.getByRole("button")).toHaveTextContent("Test");
    expect(screen.getByRole("button")).not.toHaveAttribute("disabled");
    userEvent.click(screen.getByRole("button"));
    expect(onClickMock).toHaveBeenCalled();
  });
  it("Renders the Button with disabled set to true and clicking on it does not call the function passed in the onClick prop", () => {
    const onClickMock = jest.fn();
    const { container, debug } = render(
      <Button name="test-btn" disabled onClick={onClickMock}>
        Test
      </Button>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Test");
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
    userEvent.click(screen.getByRole("button"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
});

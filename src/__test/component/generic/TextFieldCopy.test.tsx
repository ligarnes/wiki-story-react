import {render, screen} from "@testing-library/react";
import React from "react";
import {TextFieldCopy} from "../../../component/generic/TextFieldCopy";

test('render text field copy and click', () => {
  const text = "some text";
  render(<TextFieldCopy text={text}/>);
  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();
});

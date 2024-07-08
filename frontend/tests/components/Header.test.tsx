import { render, screen } from "@testing-library/react";
import Header from "../../src/components/Header";

describe("Header Component", () => {
  test("ヘッダーの表示の確認", () => {
    render(<Header />);
    expect(screen.getByText("TODOアプリ")).toBeInTheDocument();
  });
});

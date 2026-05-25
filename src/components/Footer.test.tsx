import { render, screen } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import Footer from "./Footer";
import { MantineProvider } from "@mantine/core";

const renderFooter = () => {
  return render(
    <MantineProvider>
      <Footer />
    </MantineProvider>,
  );
};

describe("Footer Component", () => {
  it("renders the current year and copyright notice", () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString(), "i"))).toBeDefined();
    expect(screen.getByText(/Anthony Larson/i)).toBeDefined();
    expect(screen.getByText(/All rights reserved/i)).toBeDefined();
  });
});

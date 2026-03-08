/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("../frontend/popup/components/TrustScore", () => ({
  TrustScore: ({ score }: { score: number }) => (
    <div data-testid="trust-score">Score: {score}</div>
  ),
}));

jest.mock("../frontend/popup/components/TrustMetrics", () => ({
  TrustMetrics: ({ metrics }: { metrics: { name: string; score: number }[] }) => (
    <div data-testid="trust-metrics">
      Metrics Count: {metrics.length}
    </div>
  ),
}));

import App from "../frontend/popup/App";

type TrustData = {
  score: number;
  metrics: { name: string; score: number }[];
};

describe("App Component", () => {
  const mockData: TrustData = {
    score: 82,
    metrics: [
      { name: "Reviews", score: 90 },
      { name: "Seller Rating", score: 75 }
    ]
  };

  test("renders SafeCart header", () => {
    render(<App trustData={mockData} />);

    expect(screen.getByText("SafeCart")).toBeInTheDocument();
  });

  test("renders TrustScore with correct score", () => {
    render(<App trustData={mockData} />);

    expect(screen.getByTestId("trust-score")).toHaveTextContent("Score: 82");
  });

  test("TrustMetrics is hidden initially", () => {
    render(<App trustData={mockData} />);

    expect(screen.queryByTestId("trust-metrics")).toBeNull();
  });

  test("button text toggles when details open", () => {
    render(<App trustData={mockData} />);

    const button = screen.getByRole("button");

    expect(screen.getByText("View Trust Metrics")).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByText("Hide Details")).toBeInTheDocument();
  });

  test("footer text renders", () => {
    render(<App trustData={mockData} />);

    expect(
      screen.getByText(
        "SafeCart analyzes multiple factors to assess listing trustworthiness"
      )
    ).toBeInTheDocument();
  });
});
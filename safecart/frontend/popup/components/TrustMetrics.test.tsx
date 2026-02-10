// TrustMetrics.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { TrustMetrics } from "./TrustMetrics"; // adjust the path if needed

describe("TrustMetrics component", () => {
  const metricsMock = [
    {
      name: "Price vs Market",
      score: 85,
      status: "positive" as const,
      description: "The product is reasonably priced compared to market value.",
    },
    {
      name: "Review Authenticity",
      score: 60,
      status: "warning" as const,
      description: "Some reviews may be fake or misleading.",
    },
    {
      name: "Seller History",
      score: 30,
      status: "negative" as const,
      description: "Seller has a poor track record.",
    },
  ];

  test("renders all metric names, scores, and descriptions", () => {
    render(<TrustMetrics metrics={metricsMock} />);

    metricsMock.forEach(metric => {
      expect(screen.getByText(metric.name)).toBeInTheDocument();
      expect(screen.getByText(`${metric.score}%`)).toBeInTheDocument();
      expect(screen.getByText(metric.description)).toBeInTheDocument();
    });
  });

  test("renders correct status colors for scores", () => {
    render(<TrustMetrics metrics={metricsMock} />);

    // positive metric should have green text
    const positiveScore = screen.getByText("85%");
    expect(positiveScore).toHaveClass("text-green-600");

    // warning metric should have yellow text
    const warningScore = screen.getByText("60%");
    expect(warningScore).toHaveClass("text-yellow-600");

    // negative metric should have red text
    const negativeScore = screen.getByText("30%");
    expect(negativeScore).toHaveClass("text-red-600");
  });

  test("renders the info box at the bottom", () => {
    render(<TrustMetrics metrics={metricsMock} />);
    expect(
      screen.getByText(/Our algorithm evaluates price vs. market value/i)
    ).toBeInTheDocument();
  });
});


// TrustMetrics.test.tsx
import { render, screen } from "@testing-library/react";
import { TrustMetrics } from "../frontend/popup/components/TrustMetrics"; // adjust the path if needed

describe("TrustMetrics component", () => {
  const metricsMock = [
    {
      name: "Price vs Market",
      score: 85,
    },
    {
      name: "Review Authenticity",
      score: 49,
    },
    {
      name: "Seller History",
      score: 10,
    },
  ];

  test("renders all metric names, scores, and descriptions", () => {
    render(<TrustMetrics metrics={metricsMock} />);

    metricsMock.forEach(metric => {
      expect(screen.getByText(metric.name)).toBeInTheDocument();
      expect(screen.getByText(`${metric.score}%`)).toBeInTheDocument();
    });
  });

  test("renders correct status colors for scores", () => {
    render(<TrustMetrics metrics={metricsMock} />);

    // positive metric should have green text
    const positiveScore = screen.getByText("85%");
    expect(positiveScore).toHaveClass("text-green-600");

    // warning metric should have yellow text
    const warningScore = screen.getByText("49%");
    expect(warningScore).toHaveClass("text-yellow-600");

    // negative metric should have red text
    const negativeScore = screen.getByText("10%");
    expect(negativeScore).toHaveClass("text-red-600");
  });

  test("renders the info box at the bottom", () => {
    render(<TrustMetrics metrics={metricsMock} />);
    expect(
        screen.getByText(/These metric scores do not imply trustworthiness on their own, but instead encode how much each factor contributed to the overall trust score./i)
    ).toBeInTheDocument();
  });
});

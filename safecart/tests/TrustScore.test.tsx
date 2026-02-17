// TrustScore.test.tsx
import { render, screen } from "@testing-library/react";
import { TrustScore } from "../frontend/popup/components/TrustScore";

describe("TrustScore component", () => {
	test("renders score text and 'Highly Trustworthy' badge for high score", () => {
		render(<TrustScore score={85} />);

		expect(screen.getByText("85%")).toBeInTheDocument();
		expect(screen.getByText("Highly Trustworthy")).toBeInTheDocument();

		// percentage text should carry the green color class
		const pct = screen.getByText("85%");
		expect(pct).toHaveClass("text-green-600");
	});

	test("renders correct labels and classes for mid and low scores", () => {
		render(<>
			<TrustScore score={65} />
			<TrustScore score={45} />
			<TrustScore score={20} />
		</>);

		expect(screen.getByText("Generally Trustworthy")).toBeInTheDocument();
		expect(screen.getByText("Proceed with Caution")).toBeInTheDocument();
		expect(screen.getByText("Not Recommended")).toBeInTheDocument();

		expect(screen.getByText("65%")).toHaveClass("text-blue-600");
		expect(screen.getByText("45%")).toHaveClass("text-yellow-600");
		expect(screen.getByText("20%")).toHaveClass("text-red-600");
	});

	test("progress circle strokeDashoffset reflects score percentage", () => {
		const { container } = render(<TrustScore score={75} />);

		// the second <circle> element in the svg is the progress circle
		const circles = container.querySelectorAll('svg circle');
		expect(circles.length).toBeGreaterThanOrEqual(2);
		const progress = circles[1];

		// compute expected offset using same radius as component
		const radius = 58;
		const circumference = 2 * Math.PI * radius;
		const expectedOffset = circumference - (75 / 100) * circumference;

		const attr = progress.getAttribute('stroke-dashoffset');
		expect(attr).not.toBeNull();

		// allow small rounding differences: compare numeric values within tolerance
		const actual = Number(attr);
		expect(Math.abs(actual - expectedOffset)).toBeLessThan(0.5);
	});
});

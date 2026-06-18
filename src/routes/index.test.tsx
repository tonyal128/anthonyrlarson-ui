import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	useCertificationsQuery,
	useEducationQuery,
} from "../hooks/useEducationCertifications";
import { useExperiencesQuery } from "../hooks/useExperiences";
import { Home } from "./index";

// Mock the hooks
vi.mock("../hooks/useExperiences", () => ({
	useExperiencesQuery: vi.fn(),
}));

vi.mock("../hooks/useEducationCertifications", () => ({
	useEducationQuery: vi.fn(),
	useCertificationsQuery: vi.fn(),
}));

// Mock data
const mockExperiences = [
	{
		id: "exp1",
		employer: {
			name: "Tech Corp",
			jobTitle: "Frontend Developer",
			startDate: "2020",
			endDate: "2022",
			experience: [
				{
					text: "Built modern web apps",
					technologies: [
						{ name: "React", tags: [] },
						{ name: "TypeScript", tags: [] },
					],
				},
				{
					text: "Deployed to cloud",
					technologies: [{ name: "AWS", tags: [] }],
				},
			],
		},
	},
	{
		id: "exp2",
		employer: {
			name: "Startup Inc",
			jobTitle: "Backend Engineer",
			startDate: "2018",
			endDate: "2020",
			experience: [
				{
					text: "Created APIs",
					technologies: [
						{ name: "NodeJS", tags: [] },
						{ name: "AWS", tags: [] },
					],
				},
			],
		},
	},
];

describe("Home Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		// Setup mock returns
		(useExperiencesQuery as any).mockReturnValue({
			data: mockExperiences,
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		});

		(useEducationQuery as any).mockReturnValue({
			data: [],
			isLoading: false,
		});

		(useCertificationsQuery as any).mockReturnValue({
			data: [],
			isLoading: false,
		});
	});

	const renderComponent = () => {
		return render(
			<MantineProvider>
				<Home />
			</MantineProvider>,
		);
	};

	it("renders correctly and derives skills from experience data", () => {
		renderComponent();

		// Check basic rendering
		expect(screen.getByText("Anthony Larson")).toBeInTheDocument();
		expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
		expect(screen.getByText("Backend Engineer")).toBeInTheDocument();

		// Check derived skills exist in the skills bar (AWS, NodeJS, React, TypeScript)
		// We expect badges for each unique technology
		expect(screen.getAllByText("AWS")[0]).toBeInTheDocument();
		expect(screen.getAllByText("React")[0]).toBeInTheDocument();
		expect(screen.getAllByText("NodeJS")[0]).toBeInTheDocument();
		expect(screen.getAllByText("TypeScript")[0]).toBeInTheDocument();
	});

	it("triggers window.print when Export as Resume is clicked", () => {
		// Mock window.print
		const printMock = vi.spyOn(window, "print").mockImplementation(() => {});

		renderComponent();

		const exportBtn = screen.getByText("Export as Resume");
		fireEvent.click(exportBtn);

		expect(printMock).toHaveBeenCalledOnce();

		printMock.mockRestore();
	});

	it("filters experience by selected skill", () => {
		renderComponent();

		// Both jobs should be visible initially
		expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
		expect(screen.getByText("Backend Engineer")).toBeInTheDocument();

		// Switch to hide mode by clicking the label text
		const hideModeText = screen.getByText("Hide Others");
		fireEvent.click(hideModeText);

		// Click the React badge to filter. It might be rendered multiple times (once in the skills bar, once in the job if visible)
		// We'll just click the first one which should be the filter badge.
		const reactBadges = screen.getAllByText("React");
		fireEvent.click(reactBadges[0]);

		// Now Backend Engineer should NOT be in the document because it doesn't have React
		expect(screen.queryByText("Backend Engineer")).not.toBeInTheDocument();
		// Frontend Developer should still be there
		expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
	});

	it("filters experience by search query", () => {
		renderComponent();

		// Switch to hide mode
		const hideModeText = screen.getByText("Hide Others");
		fireEvent.click(hideModeText);

		// Search for "Backend"
		const searchInput = screen.getByPlaceholderText(/Search/i);
		fireEvent.change(searchInput, { target: { value: "Backend" } });

		// Now Frontend Developer should be hidden, Backend Engineer should be visible
		expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument();
		expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
	});
});

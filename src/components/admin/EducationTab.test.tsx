import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import EducationTab from "./EducationTab";
import * as hooks from "../../hooks/useEducationCertifications";

vi.mock("../../hooks/useEducationCertifications");

describe("EducationTab Component", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(hooks.useCreateEducationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
		vi.mocked(hooks.useUpdateEducationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
		vi.mocked(hooks.useDeleteEducationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
	});

	it("renders loading state", () => {
		vi.mocked(hooks.useEducationQuery).mockReturnValue({
			data: [],
			isLoading: true,
			isError: false,
		} as any);

		const { container } = render(
			<MantineProvider>
				<EducationTab />
			</MantineProvider>
		);
		
		expect(container.querySelector(".mantine-Loader-root")).toBeDefined();
	});

	it("renders education list", () => {
		vi.mocked(hooks.useEducationQuery).mockReturnValue({
			data: [
				{ id: "1", degree: "B.S. Computer Science", institution: "University", period: "2018 - 2022" }
			],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<EducationTab />
			</MantineProvider>
		);

		expect(screen.getByText("B.S. Computer Science")).toBeDefined();
		expect(screen.getByText("University")).toBeDefined();
	});

	it("opens the Add Education modal", async () => {
		vi.mocked(hooks.useEducationQuery).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<EducationTab />
			</MantineProvider>
		);

		const addButton = screen.getByText("Add Education");
		fireEvent.click(addButton);

		expect(await screen.findByText("Add Education", { selector: '.mantine-Modal-title' })).toBeDefined();
	});
});

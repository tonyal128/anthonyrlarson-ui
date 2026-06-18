import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as hooks from "../../hooks/useEducationCertifications";
import EducationTab from "./EducationTab";

vi.mock("../../hooks/useEducationCertifications");

describe("EducationTab Component", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(hooks.useCreateEducationMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
		vi.mocked(hooks.useUpdateEducationMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
		vi.mocked(hooks.useDeleteEducationMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
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
			</MantineProvider>,
		);

		expect(container.querySelector(".mantine-Loader-root")).toBeDefined();
	});

	it("renders education list", () => {
		vi.mocked(hooks.useEducationQuery).mockReturnValue({
			data: [
				{
					id: "1",
					degree: "B.S. Computer Science",
					institution: "University",
					period: "2018 - 2022",
				},
			],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<EducationTab />
			</MantineProvider>,
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
			</MantineProvider>,
		);

		const addButton = screen.getByText("Add Education");
		fireEvent.click(addButton);

		expect(
			await screen.findByText("Add Education", {
				selector: ".mantine-Modal-title",
			}),
		).toBeDefined();
	});
});

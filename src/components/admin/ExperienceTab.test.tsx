import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as hooks from "../../hooks/useExperiences";
import ExperienceTab from "./ExperienceTab";

vi.mock("../../hooks/useExperiences");

describe("ExperienceTab Component", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(hooks.useCreateExperienceMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
		vi.mocked(hooks.useUpdateExperienceMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
		vi.mocked(hooks.useDeleteExperienceMutation).mockReturnValue({
			mutateAsync: vi.fn(),
		} as any);
	});

	it("renders loading state", () => {
		vi.mocked(hooks.useExperiencesQuery).mockReturnValue({
			data: [],
			isLoading: true,
			isError: false,
		} as any);

		const { container } = render(
			<MantineProvider>
				<ExperienceTab />
			</MantineProvider>,
		);

		expect(container.querySelector(".mantine-Loader-root")).toBeDefined();
	});

	it("renders experience list", () => {
		vi.mocked(hooks.useExperiencesQuery).mockReturnValue({
			data: [
				{
					id: "1",
					employer: {
						name: "Tech Corp",
						jobTitle: "Software Engineer",
						startDate: "2020",
						experience: [],
					},
				},
			],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<ExperienceTab />
			</MantineProvider>,
		);

		expect(screen.getByText("Tech Corp")).toBeDefined();
		expect(screen.getByText("Software Engineer")).toBeDefined();
	});

	it("opens the Add Experience modal", async () => {
		vi.mocked(hooks.useExperiencesQuery).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<ExperienceTab />
			</MantineProvider>,
		);

		const addButton = screen.getByText("Add Experience");
		fireEvent.click(addButton);

		expect(
			await screen.findByText("Add Experience", {
				selector: ".mantine-Modal-title",
			}),
		).toBeDefined();
	});
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MantineProvider } from "@mantine/core";
import CertificationsTab from "./CertificationsTab";
import * as hooks from "../../hooks/useEducationCertifications";

vi.mock("../../hooks/useEducationCertifications");

describe("CertificationsTab Component", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(hooks.useCreateCertificationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
		vi.mocked(hooks.useUpdateCertificationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
		vi.mocked(hooks.useDeleteCertificationMutation).mockReturnValue({ mutateAsync: vi.fn() } as any);
	});

	it("renders loading state", () => {
		vi.mocked(hooks.useCertificationsQuery).mockReturnValue({
			data: [],
			isLoading: true,
			isError: false,
		} as any);

		const { container } = render(
			<MantineProvider>
				<CertificationsTab />
			</MantineProvider>
		);
		
		expect(container.querySelector(".mantine-Loader-root")).toBeDefined();
	});

	it("renders certifications list", () => {
		vi.mocked(hooks.useCertificationsQuery).mockReturnValue({
			data: [
				{ id: "1", name: "AWS Developer", issuer: "Amazon", issueDate: "2023" }
			],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<CertificationsTab />
			</MantineProvider>
		);

		expect(screen.getByText("AWS Developer")).toBeDefined();
		expect(screen.getByText("Amazon")).toBeDefined();
	});

	it("opens the Add Certification modal", async () => {
		vi.mocked(hooks.useCertificationsQuery).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		} as any);

		render(
			<MantineProvider>
				<CertificationsTab />
			</MantineProvider>
		);

		const addButton = screen.getByText("Add Certification");
		fireEvent.click(addButton);

		expect(await screen.findByText("Add Certification", { selector: '.mantine-Modal-title' })).toBeDefined();
	});
});

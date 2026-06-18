import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import {
	useEducationQuery,
	useCreateEducationMutation,
	useUpdateEducationMutation,
	useDeleteEducationMutation,
	useCertificationsQuery,
	useCreateCertificationMutation,
	useUpdateCertificationMutation,
	useDeleteCertificationMutation,
} from "./useEducationCertifications";

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
				staleTime: 0,
			},
		},
	});

describe("useEducationCertifications Hooks", () => {
	let queryClient: QueryClient;
	let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

	beforeEach(() => {
		localStorage.clear();
		queryClient = createTestQueryClient();
		wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	});

	it("should load the initial education and certification items", async () => {
		const { result: eduResult } = renderHook(() => useEducationQuery(), { wrapper });
		const { result: certResult } = renderHook(() => useCertificationsQuery(), { wrapper });

		await waitFor(() => expect(eduResult.current.isSuccess).toBe(true));
		await waitFor(() => expect(certResult.current.isSuccess).toBe(true));

		expect(eduResult.current.data).toHaveLength(1);
		expect(eduResult.current.data?.[0].institution).toBe("Des Moines Area Community College");

		expect(certResult.current.data).toHaveLength(1);
		expect(certResult.current.data?.[0].name).toBe("AWS Certified Developer – Associate");
	});

	it("should support education CRUD operations", async () => {
		const { result: queryResult } = renderHook(() => useEducationQuery(), { wrapper });
		const { result: createResult } = renderHook(() => useCreateEducationMutation(), { wrapper });
		const { result: updateResult } = renderHook(() => useUpdateEducationMutation(), { wrapper });
		const { result: deleteResult } = renderHook(() => useDeleteEducationMutation(), { wrapper });

		await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

		// Create
		let addedRecord;
		await act(async () => {
			addedRecord = await createResult.current.mutateAsync({
				degree: "Bachelor of Science",
				institution: "Iowa State University",
				period: "2020",
			});
		});

		await waitFor(() => expect(queryResult.current.data).toHaveLength(2));
		expect(queryResult.current.data?.[1].degree).toBe("Bachelor of Science");

		// Update
		await act(async () => {
			await updateResult.current.mutateAsync({
				...addedRecord!,
				degree: "Master of Science",
			});
		});

		await waitFor(() => expect(queryResult.current.data?.[1].degree).toBe("Master of Science"));

		// Delete
		await act(async () => {
			await deleteResult.current.mutateAsync(addedRecord!.id);
		});

		await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
	});

	it("should support certification CRUD operations", async () => {
		const { result: queryResult } = renderHook(() => useCertificationsQuery(), { wrapper });
		const { result: createResult } = renderHook(() => useCreateCertificationMutation(), { wrapper });
		const { result: updateResult } = renderHook(() => useUpdateCertificationMutation(), { wrapper });
		const { result: deleteResult } = renderHook(() => useDeleteCertificationMutation(), { wrapper });

		await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

		// Create
		let addedRecord;
		await act(async () => {
			addedRecord = await createResult.current.mutateAsync({
				name: "Kubernetes Administrator (CKA)",
				issuer: "CNCF",
				issueDate: "2025",
			});
		});

		await waitFor(() => expect(queryResult.current.data).toHaveLength(2));
		expect(queryResult.current.data?.[1].name).toBe("Kubernetes Administrator (CKA)");

		// Update
		await act(async () => {
			await updateResult.current.mutateAsync({
				...addedRecord!,
				name: "CKA Update",
			});
		});

		await waitFor(() => expect(queryResult.current.data?.[1].name).toBe("CKA Update"));

		// Delete
		await act(async () => {
			await deleteResult.current.mutateAsync(addedRecord!.id);
		});

		await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
	});
});

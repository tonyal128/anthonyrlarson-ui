import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import {
	useCreateExperienceMutation,
	useDeleteExperienceMutation,
	useExperiencesQuery,
	useUpdateExperienceMutation,
} from "./useExperiences";

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

describe("useExperiences Hooks", () => {
	let queryClient: QueryClient;
	let wrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

	let mockExperiences = [];

	beforeEach(() => {
		queryClient = createTestQueryClient();
		wrapper = ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		mockExperiences = [
			{ id: "1", employer: { name: "Company A", jobTitle: "Dev", startDate: "2020" } }
		];

		global.fetch = vi.fn(async (url, options) => {
			if (url.includes("/experiences")) {
				if (!options || options.method === "GET") {
					return { ok: true, json: async () => mockExperiences };
				}
				if (options.method === "POST") {
					const body = JSON.parse(options.body);
					const newExp = { ...body, id: "2" };
					mockExperiences.push(newExp);
					return { ok: true, json: async () => newExp };
				}
				if (options.method === "PUT") {
					const body = JSON.parse(options.body);
					mockExperiences = mockExperiences.map(e => e.id === body.id ? body : e);
					return { ok: true, json: async () => body };
				}
				if (options.method === "DELETE") {
					const id = url.split("/").pop();
					mockExperiences = mockExperiences.filter(e => e.id !== id);
					return { ok: true };
				}
			}
			return { ok: false };
		});
	});

	it("should load experiences from the API", async () => {
		const { result } = renderHook(() => useExperiencesQuery(), { wrapper });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(result.current.data).toHaveLength(1);
		expect(result.current.data?.[0].employer.name).toBe("Company A");
	});

	it("should successfully add a new experience via API", async () => {
		const { result } = renderHook(() => ({
			query: useExperiencesQuery(),
			create: useCreateExperienceMutation(),
		}), { wrapper });

		await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

		await act(async () => {
			await result.current.create.mutateAsync({ employer: { name: "New Co", jobTitle: "Lead", startDate: "2021", experience: [] } });
		});

		await waitFor(() => expect(result.current.query.data).toHaveLength(2));
	});

	it("should update an existing experience via API", async () => {
		const { result } = renderHook(() => ({
			query: useExperiencesQuery(),
			update: useUpdateExperienceMutation(),
		}), { wrapper });

		await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

		await act(async () => {
			await result.current.update.mutateAsync({ id: "1", employer: { name: "Company B", jobTitle: "Manager", startDate: "2020", experience: [] } });
		});

		await waitFor(() => expect(result.current.query.data?.[0].employer.name).toBe("Company B"));
	});

	it("should delete an experience via API", async () => {
		const { result } = renderHook(() => ({
			query: useExperiencesQuery(),
			remove: useDeleteExperienceMutation(),
		}), { wrapper });

		await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

		await act(async () => {
			await result.current.remove.mutateAsync("1");
		});

		await waitFor(() => expect(result.current.query.data).toHaveLength(0));
	});
});

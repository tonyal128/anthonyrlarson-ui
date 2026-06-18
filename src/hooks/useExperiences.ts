import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";

export interface Technology {
	name: string;
	description: string;
	tags: string[];
}

export interface ExperienceItem {
	text: string;
	technologies?: Technology[];
}

export interface Employer {
	name: string;
	startDate: string;
	endDate?: string | null;
	jobTitle: string;
	experience: ExperienceItem[];
}

export interface ExperienceRecord {
	id: string;
	employer: Employer;
}

const API_BASE_URL = import.meta.env.VITE_EXPERIENCE_API_URL || "";

async function getHeaders() {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	try {
		const session = await fetchAuthSession();
		const idToken = session.tokens?.idToken?.toString();
		if (idToken) {
			headers["Authorization"] = idToken;
		}
	} catch (e) {
		console.warn("Could not fetch auth session", e);
	}
	return headers;
}

// Fetch all experiences
async function fetchExperiences(): Promise<ExperienceRecord[]> {

	const response = await fetch(`${API_BASE_URL}/experiences`);
	if (!response.ok) {
		throw new Error("Failed to fetch experiences");
	}
	return response.json();
}

// Add an experience
async function createExperience(
	newRecord: Omit<ExperienceRecord, "id">,
): Promise<ExperienceRecord> {
	const response = await fetch(`${API_BASE_URL}/experiences`, {
		method: "POST",
		headers: await getHeaders(),
		body: JSON.stringify(newRecord),
	});
	if (!response.ok) {
		throw new Error("Failed to create experience");
	}
	return response.json();
}

// Update an experience
async function updateExperience(
	record: ExperienceRecord,
): Promise<ExperienceRecord> {
	const response = await fetch(`${API_BASE_URL}/experiences/${record.id}`, {
		method: "PUT",
		headers: await getHeaders(),
		body: JSON.stringify(record),
	});
	if (!response.ok) {
		throw new Error("Failed to update experience");
	}
	return response.json();
}

// Delete an experience
async function deleteExperience(id: string): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
		method: "DELETE",
		headers: await getHeaders(),
	});
	if (!response.ok) {
		throw new Error("Failed to delete experience");
	}
}

export function useExperiencesQuery() {
	return useQuery({
		queryKey: ["experiences"],
		queryFn: fetchExperiences,
		select: (data) => {
			return [...data].sort((a, b) => {
				const getEndDate = (exp: ExperienceRecord) => {
					if (!exp.employer.endDate || exp.employer.endDate === "Present") return Infinity;
					const parsed = new Date(exp.employer.endDate).getTime();
					return isNaN(parsed) ? 0 : parsed;
				};
				const endA = getEndDate(a);
				const endB = getEndDate(b);
				
				if (endA !== endB) return endB - endA;
				
				const getStartDate = (exp: ExperienceRecord) => {
					if (!exp.employer.startDate) return 0;
					const parsed = new Date(exp.employer.startDate).getTime();
					return isNaN(parsed) ? 0 : parsed;
				};
				return getStartDate(b) - getStartDate(a);
			});
		},
	});
}

export function useCreateExperienceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createExperience,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["experiences"] });
		},
	});
}

export function useUpdateExperienceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateExperience,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["experiences"] });
		},
	});
}

export function useDeleteExperienceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteExperience,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["experiences"] });
		},
	});
}

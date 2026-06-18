import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";

export interface EducationRecord {
	id: string;
	degree: string;
	institution: string;
	period: string;
	description?: string;
}

export interface CertificationRecord {
	id: string;
	name: string;
	issuer: string;
	issueDate: string;
	url?: string;
	credentialId?: string;
}

const LOCAL_STORAGE_EDU_KEY = "anthonyrlarson_education";
const LOCAL_STORAGE_CERT_KEY = "anthonyrlarson_certifications";

const EDU_API_BASE_URL = import.meta.env.VITE_EDUCATION_API_URL || "";
const CERT_API_BASE_URL = import.meta.env.VITE_CERTIFICATIONS_API_URL || "";

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

const initialEducation: EducationRecord[] = [
	{
		id: "edu-1",
		degree: "Associates in Applied Science",
		institution: "Des Moines Area Community College",
		period: "Class of 2018",
		description: "Focused on Information Technology and Software Development.",
	},
];

const initialCertifications: CertificationRecord[] = [
	{
		id: "cert-1",
		name: "AWS Certified Developer – Associate",
		issuer: "Amazon Web Services (AWS)",
		issueDate: "2024",
		url: "https://aws.amazon.com",
	},
];

// Helper to get from local storage
function getLocalStorageEdu(): EducationRecord[] {
	if (typeof window === "undefined") return initialEducation;
	const data = localStorage.getItem(LOCAL_STORAGE_EDU_KEY);
	if (!data) {
		localStorage.setItem(LOCAL_STORAGE_EDU_KEY, JSON.stringify(initialEducation));
		return initialEducation;
	}
	try {
		return JSON.parse(data);
	} catch {
		return initialEducation;
	}
}

function saveLocalStorageEdu(records: EducationRecord[]) {
	if (typeof window === "undefined") return;
	localStorage.setItem(LOCAL_STORAGE_EDU_KEY, JSON.stringify(records));
}

function getLocalStorageCert(): CertificationRecord[] {
	if (typeof window === "undefined") return initialCertifications;
	const data = localStorage.getItem(LOCAL_STORAGE_CERT_KEY);
	if (!data) {
		localStorage.setItem(LOCAL_STORAGE_CERT_KEY, JSON.stringify(initialCertifications));
		return initialCertifications;
	}
	try {
		return JSON.parse(data);
	} catch {
		return initialCertifications;
	}
}

function saveLocalStorageCert(records: CertificationRecord[]) {
	if (typeof window === "undefined") return;
	localStorage.setItem(LOCAL_STORAGE_CERT_KEY, JSON.stringify(records));
}

// ----------------------------------------------------
// EDUCATION SERVICES
// ----------------------------------------------------
async function fetchEducation(): Promise<EducationRecord[]> {
	if (!EDU_API_BASE_URL) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		return getLocalStorageEdu();
	}
	try {
		const response = await fetch(`${EDU_API_BASE_URL}/education`);
		if (!response.ok) {
			if (response.status === 404 || response.status === 403) {
				return []; // Treat missing endpoints or auth errors as empty lists
			}
			throw new Error(`Failed to fetch education records: ${response.statusText}`);
		}
		return await response.json();
	} catch (error: any) {
		if (error.message === "Failed to fetch") {
			console.warn("Education API is unreachable (possibly CORS or empty table). Treating as empty list.");
			return [];
		}
		throw error;
	}
}

async function createEducation(
	newRecord: Omit<EducationRecord, "id">,
): Promise<EducationRecord> {
	if (!EDU_API_BASE_URL) {
		const records = getLocalStorageEdu();
		const createdRecord = {
			...newRecord,
			id: `edu-${Math.random().toString(36).substring(2, 11)}`,
		};
		records.push(createdRecord);
		saveLocalStorageEdu(records);
		return createdRecord;
	}
	const response = await fetch(`${EDU_API_BASE_URL}/education`, {
		method: "POST",
		headers: await getHeaders(),
		body: JSON.stringify(newRecord),
	});
	if (!response.ok) {
		throw new Error("Failed to create education record");
	}
	return response.json();
}

async function updateEducation(
	record: EducationRecord,
): Promise<EducationRecord> {
	if (!EDU_API_BASE_URL) {
		const records = getLocalStorageEdu();
		const index = records.findIndex((r) => r.id === record.id);
		if (index !== -1) {
			records[index] = record;
			saveLocalStorageEdu(records);
		}
		return record;
	}
	const response = await fetch(`${EDU_API_BASE_URL}/education/${record.id}`, {
		method: "PUT",
		headers: await getHeaders(),
		body: JSON.stringify(record),
	});
	if (!response.ok) {
		throw new Error("Failed to update education record");
	}
	return response.json();
}

async function deleteEducation(id: string): Promise<void> {
	if (!EDU_API_BASE_URL) {
		const records = getLocalStorageEdu();
		const filtered = records.filter((r) => r.id !== id);
		saveLocalStorageEdu(filtered);
		return;
	}
	const response = await fetch(`${EDU_API_BASE_URL}/education/${id}`, {
		method: "DELETE",
		headers: await getHeaders(),
	});
	if (!response.ok) {
		throw new Error("Failed to delete education record");
	}
}

// ----------------------------------------------------
// CERTIFICATION SERVICES
// ----------------------------------------------------
async function fetchCertifications(): Promise<CertificationRecord[]> {
	if (!CERT_API_BASE_URL) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		return getLocalStorageCert();
	}
	try {
		const response = await fetch(`${CERT_API_BASE_URL}/certifications`);
		if (!response.ok) {
			if (response.status === 404 || response.status === 403) {
				return []; // Treat missing endpoints or auth errors as empty lists
			}
			throw new Error(`Failed to fetch certifications: ${response.statusText}`);
		}
		return await response.json();
	} catch (error: any) {
		if (error.message === "Failed to fetch") {
			console.warn("Certifications API is unreachable (possibly CORS or empty table). Treating as empty list.");
			return [];
		}
		throw error;
	}
}

async function createCertification(
	newRecord: Omit<CertificationRecord, "id">,
): Promise<CertificationRecord> {
	if (!CERT_API_BASE_URL) {
		const records = getLocalStorageCert();
		const createdRecord = {
			...newRecord,
			id: `cert-${Math.random().toString(36).substring(2, 11)}`,
		};
		records.push(createdRecord);
		saveLocalStorageCert(records);
		return createdRecord;
	}
	const response = await fetch(`${CERT_API_BASE_URL}/certifications`, {
		method: "POST",
		headers: await getHeaders(),
		body: JSON.stringify(newRecord),
	});
	if (!response.ok) {
		throw new Error("Failed to create certification");
	}
	return response.json();
}

async function updateCertification(
	record: CertificationRecord,
): Promise<CertificationRecord> {
	if (!CERT_API_BASE_URL) {
		const records = getLocalStorageCert();
		const index = records.findIndex((r) => r.id === record.id);
		if (index !== -1) {
			records[index] = record;
			saveLocalStorageCert(records);
		}
		return record;
	}
	const response = await fetch(
		`${CERT_API_BASE_URL}/certifications/${record.id}`,
		{
			method: "PUT",
			headers: await getHeaders(),
			body: JSON.stringify(record),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update certification");
	}
	return response.json();
}

async function deleteCertification(id: string): Promise<void> {
	if (!CERT_API_BASE_URL) {
		const records = getLocalStorageCert();
		const filtered = records.filter((r) => r.id !== id);
		saveLocalStorageCert(filtered);
		return;
	}
	const response = await fetch(`${CERT_API_BASE_URL}/certifications/${id}`, {
		method: "DELETE",
		headers: await getHeaders(),
	});
	if (!response.ok) {
		throw new Error("Failed to delete certification");
	}
}

// ----------------------------------------------------
// REACT QUERY HOOKS
// ----------------------------------------------------
export function useEducationQuery() {
	return useQuery({
		queryKey: ["education"],
		queryFn: fetchEducation,
	});
}

export function useCreateEducationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createEducation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["education"] });
		},
	});
}

export function useUpdateEducationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateEducation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["education"] });
		},
	});
}

export function useDeleteEducationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteEducation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["education"] });
		},
	});
}

export function useCertificationsQuery() {
	return useQuery({
		queryKey: ["certifications"],
		queryFn: fetchCertifications,
	});
}

export function useCreateCertificationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createCertification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["certifications"] });
		},
	});
}

export function useUpdateCertificationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateCertification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["certifications"] });
		},
	});
}

export function useDeleteCertificationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCertification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["certifications"] });
		},
	});
}

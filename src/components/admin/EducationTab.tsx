import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	Group,
	Modal,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
	Loader,
	Alert,
	SimpleGrid,
} from "@mantine/core";
import {
	Plus,
	Trash2,
	Edit,
	Check,
	AlertCircle,
	GraduationCap,
} from "lucide-react";
import {
	useEducationQuery,
	useCreateEducationMutation,
	useUpdateEducationMutation,
	useDeleteEducationMutation,
	type EducationRecord,
} from "../../hooks/useEducationCertifications";

export default function EducationTab() {
	const { data: educations = [], isLoading, isError, error, refetch } = useEducationQuery();

	const createMutation = useCreateEducationMutation();
	const updateMutation = useUpdateEducationMutation();
	const deleteMutation = useDeleteEducationMutation();

	const [opened, setOpened] = useState(false);
	const [editingEdu, setEditingEdu] = useState<EducationRecord | null>(null);
	const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	// Form State
	const [eduDegree, setEduDegree] = useState("");
	const [eduInstitution, setEduInstitution] = useState("");
	const [eduPeriod, setEduPeriod] = useState("");
	const [eduDescription, setEduDescription] = useState("");

	const showStatus = (type: "success" | "error", text: string) => {
		setStatusMessage({ type, text });
		setTimeout(() => {
			setStatusMessage(null);
		}, 4000);
	};

	const handleOpenAdd = () => {
		setEditingEdu(null);
		setEduDegree("");
		setEduInstitution("");
		setEduPeriod("");
		setEduDescription("");
		setOpened(true);
	};

	const handleOpenEdit = (edu: EducationRecord) => {
		setEditingEdu(edu);
		setEduDegree(edu.degree);
		setEduInstitution(edu.institution);
		setEduPeriod(edu.period);
		setEduDescription(edu.description || "");
		setOpened(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!eduDegree.trim() || !eduInstitution.trim() || !eduPeriod.trim()) {
			showStatus("error", "Degree, Institution, and Period are required.");
			return;
		}

		const data = {
			degree: eduDegree,
			institution: eduInstitution,
			period: eduPeriod,
			description: eduDescription || undefined,
		};

		try {
			if (editingEdu) {
				await updateMutation.mutateAsync({ id: editingEdu.id, ...data });
				showStatus("success", "Education record updated successfully!");
			} else {
				await createMutation.mutateAsync(data);
				showStatus("success", "Education record added successfully!");
			}
			setOpened(false);
		} catch (err) {
			showStatus("error", err instanceof Error ? err.message : "Failed to save education record.");
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this education record?")) {
			try {
				await deleteMutation.mutateAsync(id);
				showStatus("success", "Education record deleted successfully!");
			} catch (err) {
				showStatus("error", err instanceof Error ? err.message : "Failed to delete education record.");
			}
		}
	};

	return (
		<Stack gap="xl">
			<Group justify="space-between" align="center">
				<Text size="sm" c="var(--sea-ink-soft)">
					Manage your education history.
				</Text>
				<Button
					leftSection={<Plus size={16} />}
					radius="xl"
					onClick={handleOpenAdd}
					color="blue"
				>
					Add Education
				</Button>
			</Group>

			{/* Status Message */}
			{statusMessage && (
				<Alert
					icon={statusMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
					color={statusMessage.type === "success" ? "green" : "red"}
					title={statusMessage.type === "success" ? "Success" : "Error"}
					withCloseButton
					onClose={() => setStatusMessage(null)}
				>
					{statusMessage.text}
				</Alert>
			)}

			{/* Education List */}
			{isLoading ? (
				<Group justify="center" py="xl">
					<Loader size="lg" />
				</Group>
			) : isError ? (
				<Card shadow="sm" radius="lg" className="island-shell" p="xl" style={{ border: "1px solid var(--mantine-color-red-light)" }}>
					<Stack align="center" gap="md">
						<Text c="red" fw={600}>Failed to load education items.</Text>
						<Text size="sm" c="dimmed">{error instanceof Error ? error.message : "Unknown error occurred"}</Text>
						<Button size="sm" color="red" variant="light" onClick={() => refetch()}>
							Retry
						</Button>
					</Stack>
				</Card>
			) : educations.length === 0 ? (
				<Card shadow="sm" radius="lg" className="island-shell" p="xl">
					<Stack align="center" py="xl" gap="md">
						<GraduationCap size={40} className="text-gray-400" />
						<Text c="dimmed" fw={500}>No education items found.</Text>
						<Button variant="light" onClick={handleOpenAdd}>Add education record</Button>
					</Stack>
				</Card>
			) : (
				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
					{educations.map((edu) => (
						<Card
							key={edu.id}
							shadow="sm"
							radius="lg"
							className="island-shell"
							p="xl"
							style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
						>
							<Stack gap="sm">
								<Group justify="space-between">
									<Title order={3} size="h5" c="var(--sea-ink)">
										{edu.degree}
									</Title>
									<Badge variant="light" color="cyan">
										Education
									</Badge>
								</Group>
								<Text size="sm" fw={500} c="var(--lagoon-deep)">
									{edu.institution}
								</Text>
								<Text size="xs" c="var(--sea-ink-soft)">
									{edu.period}
								</Text>
								{edu.description && (
									<Text size="sm" c="var(--sea-ink-soft)" mt="xs" style={{ whiteSpace: "pre-line" }}>
										{edu.description}
									</Text>
								)}
							</Stack>

							<Group gap="sm" mt="xl" justify="flex-end">
								<Button
									variant="light"
									color="blue"
									size="xs"
									leftSection={<Edit size={12} />}
									onClick={() => handleOpenEdit(edu)}
								>
									Edit
								</Button>
								<Button
									variant="light"
									color="red"
									size="xs"
									leftSection={<Trash2 size={12} />}
									onClick={() => handleDelete(edu.id)}
								>
									Delete
								</Button>
							</Group>
						</Card>
					))}
				</SimpleGrid>
			)}

			{/* Add/Edit Modal */}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={editingEdu ? "Edit Education" : "Add Education"}
				size="md"
				radius="md"
			>
				<form onSubmit={handleSubmit}>
					<Stack gap="md">
						<TextInput
							label="Degree / Program"
							placeholder="e.g. Associates in Applied Science"
							required
							value={eduDegree}
							onChange={(e) => setEduDegree(e.currentTarget.value)}
						/>
						<TextInput
							label="Institution"
							placeholder="e.g. DMACC"
							required
							value={eduInstitution}
							onChange={(e) => setEduInstitution(e.currentTarget.value)}
						/>
						<TextInput
							label="Period / Graduation Date"
							placeholder="e.g. Class of 2018 or 2016 - 2018"
							required
							value={eduPeriod}
							onChange={(e) => setEduPeriod(e.currentTarget.value)}
						/>
						<Textarea
							label="Description / Details"
							placeholder="e.g. Focus area, achievements"
							value={eduDescription}
							onChange={(e) => setEduDescription(e.currentTarget.value)}
							rows={3}
						/>

						<Group justify="flex-end" mt="md">
							<Button variant="default" onClick={() => setOpened(false)}>
								Cancel
							</Button>
							<Button
								type="submit"
								color="blue"
								loading={createMutation.isPending || updateMutation.isPending}
							>
								{editingEdu ? "Save Changes" : "Create"}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}

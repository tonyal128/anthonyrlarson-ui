import {
	Alert,
	Autocomplete,
	Badge,
	Button,
	Card,
	Group,
	Loader,
	Modal,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import {
	AlertCircle,
	Award,
	Check,
	Edit,
	ExternalLink,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import {
	type CertificationRecord,
	useCertificationsQuery,
	useCreateCertificationMutation,
	useDeleteCertificationMutation,
	useUpdateCertificationMutation,
} from "../../hooks/useEducationCertifications";

export default function CertificationsTab() {
	const {
		data: certifications = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useCertificationsQuery();

	const createMutation = useCreateCertificationMutation();
	const updateMutation = useUpdateCertificationMutation();
	const deleteMutation = useDeleteCertificationMutation();

	const [opened, setOpened] = useState(false);
	const [editingCert, setEditingCert] = useState<CertificationRecord | null>(
		null,
	);
	const [statusMessage, setStatusMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const uniqueIssuers = Array.from(
		new Set(certifications.map((c) => c.issuer).filter(Boolean)),
	).sort();

	// Form State
	const [certName, setCertName] = useState("");
	const [certIssuer, setCertIssuer] = useState("");
	const [certIssueDate, setCertIssueDate] = useState("");
	const [certUrl, setCertUrl] = useState("");
	const [certCredentialId, setCertCredentialId] = useState("");

	const showStatus = (type: "success" | "error", text: string) => {
		setStatusMessage({ type, text });
		setTimeout(() => {
			setStatusMessage(null);
		}, 4000);
	};

	const handleOpenAdd = () => {
		setEditingCert(null);
		setCertName("");
		setCertIssuer("");
		setCertIssueDate("");
		setCertUrl("");
		setCertCredentialId("");
		setOpened(true);
	};

	const handleOpenEdit = (cert: CertificationRecord) => {
		setEditingCert(cert);
		setCertName(cert.name);
		setCertIssuer(cert.issuer);
		setCertIssueDate(cert.issueDate);
		setCertUrl(cert.url || "");
		setCertCredentialId(cert.credentialId || "");
		setOpened(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!certName.trim() || !certIssuer.trim() || !certIssueDate.trim()) {
			showStatus(
				"error",
				"Certification Name, Issuer, and Issue Date are required.",
			);
			return;
		}

		const data = {
			name: certName,
			issuer: certIssuer,
			issueDate: certIssueDate,
			url: certUrl || undefined,
			credentialId: certCredentialId || undefined,
		};

		try {
			if (editingCert) {
				await updateMutation.mutateAsync({ id: editingCert.id, ...data });
				showStatus("success", "Certification updated successfully!");
			} else {
				await createMutation.mutateAsync(data);
				showStatus("success", "Certification added successfully!");
			}
			setOpened(false);
		} catch (err) {
			showStatus(
				"error",
				err instanceof Error ? err.message : "Failed to save certification.",
			);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this certification?")) {
			try {
				await deleteMutation.mutateAsync(id);
				showStatus("success", "Certification deleted successfully!");
			} catch (err) {
				showStatus(
					"error",
					err instanceof Error
						? err.message
						: "Failed to delete certification.",
				);
			}
		}
	};

	return (
		<Stack gap="xl">
			<Group justify="space-between" align="center">
				<Text size="sm" c="var(--sea-ink-soft)">
					Manage your professional certifications and credentials.
				</Text>
				<Button
					leftSection={<Plus size={16} />}
					radius="xl"
					onClick={handleOpenAdd}
					color="blue"
				>
					Add Certification
				</Button>
			</Group>

			{/* Status Message */}
			{statusMessage && (
				<Alert
					icon={
						statusMessage.type === "success" ? (
							<Check size={16} />
						) : (
							<AlertCircle size={16} />
						)
					}
					color={statusMessage.type === "success" ? "green" : "red"}
					title={statusMessage.type === "success" ? "Success" : "Error"}
					withCloseButton
					onClose={() => setStatusMessage(null)}
				>
					{statusMessage.text}
				</Alert>
			)}

			{/* Certifications List */}
			{isLoading ? (
				<Group justify="center" py="xl">
					<Loader size="lg" />
				</Group>
			) : isError ? (
				<Card
					shadow="sm"
					radius="lg"
					className="island-shell"
					p="xl"
					style={{ border: "1px solid var(--mantine-color-red-light)" }}
				>
					<Stack align="center" gap="md">
						<Text c="red" fw={600}>
							Failed to load certifications.
						</Text>
						<Text size="sm" c="dimmed">
							{error instanceof Error
								? error.message
								: "Unknown error occurred"}
						</Text>
						<Button
							size="sm"
							color="red"
							variant="light"
							onClick={() => refetch()}
						>
							Retry
						</Button>
					</Stack>
				</Card>
			) : certifications.length === 0 ? (
				<Card shadow="sm" radius="lg" className="island-shell" p="xl">
					<Stack align="center" py="xl" gap="md">
						<Award size={40} className="text-gray-400" />
						<Text c="dimmed" fw={500}>
							No certifications found.
						</Text>
						<Button variant="light" onClick={handleOpenAdd}>
							Add certification
						</Button>
					</Stack>
				</Card>
			) : (
				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
					{certifications.map((cert) => (
						<Card
							key={cert.id}
							shadow="sm"
							radius="lg"
							className="island-shell"
							p="xl"
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
							}}
						>
							<Stack gap="sm">
								<Group justify="space-between">
									<Title order={3} size="h5" c="var(--sea-ink)">
										{cert.name}
									</Title>
									<Badge variant="light" color="teal">
										Credential
									</Badge>
								</Group>
								<Text size="sm" fw={500} c="var(--lagoon-deep)">
									{cert.issuer}
								</Text>
								<Text size="xs" c="var(--sea-ink-soft)">
									Issued in {cert.issueDate}
								</Text>
								{cert.credentialId && (
									<Text size="xs" c="var(--sea-ink-soft)">
										Credential ID: {cert.credentialId}
									</Text>
								)}
								{cert.url && (
									<Group gap={4} mt="xs">
										<a
											href={cert.url}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
										>
											View Credential <ExternalLink size={10} />
										</a>
									</Group>
								)}
							</Stack>

							<Group gap="sm" mt="xl" justify="flex-end">
								<Button
									variant="light"
									color="blue"
									size="xs"
									leftSection={<Edit size={12} />}
									onClick={() => handleOpenEdit(cert)}
								>
									Edit
								</Button>
								<Button
									variant="light"
									color="red"
									size="xs"
									leftSection={<Trash2 size={12} />}
									onClick={() => handleDelete(cert.id)}
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
				title={editingCert ? "Edit Certification" : "Add Certification"}
				size="md"
				radius="md"
			>
				<form onSubmit={handleSubmit}>
					<Stack gap="md">
						<TextInput
							label="Certification Name"
							placeholder="e.g. AWS Certified Developer"
							required
							value={certName}
							onChange={(e) => setCertName(e.currentTarget.value)}
						/>
						<Autocomplete
							label="Issuer"
							placeholder="e.g. Amazon Web Services"
							required
							data={uniqueIssuers}
							value={certIssuer}
							onChange={setCertIssuer}
						/>
						<TextInput
							label="Issue Date / Year"
							placeholder="e.g. 2024"
							required
							value={certIssueDate}
							onChange={(e) => setCertIssueDate(e.currentTarget.value)}
						/>
						<TextInput
							label="Credential URL"
							placeholder="e.g. https://aws.amazon.com/..."
							value={certUrl}
							onChange={(e) => setCertUrl(e.currentTarget.value)}
						/>
						<TextInput
							label="Credential ID"
							placeholder="e.g. ABC-123456"
							value={certCredentialId}
							onChange={(e) => setCertCredentialId(e.currentTarget.value)}
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
								{editingCert ? "Save Changes" : "Create"}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}

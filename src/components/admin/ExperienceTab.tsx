import {
	ActionIcon,
	Alert,
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	Group,
	List,
	ListItem,
	Loader,
	Modal,
	SimpleGrid,
	Stack,
	TagsInput,
	Text,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
	AlertCircle,
	Briefcase,
	Check,
	Edit,
	Plus,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	type ExperienceItem,
	type ExperienceRecord,
	useCreateExperienceMutation,
	useDeleteExperienceMutation,
	useExperiencesQuery,
	useUpdateExperienceMutation,
} from "../../hooks/useExperiences";

export default function ExperienceTab() {
	const {
		data: experiences = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useExperiencesQuery();

	const createMutation = useCreateExperienceMutation();
	const updateMutation = useUpdateExperienceMutation();
	const deleteMutation = useDeleteExperienceMutation();

	const [opened, setOpened] = useState(false);
	const [editingExperience, setEditingExperience] =
		useState<ExperienceRecord | null>(null);
	const [statusMessage, setStatusMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Form State
	const [companyName, setCompanyName] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [isPresent, setIsPresent] = useState(false);
	const [bullets, setBullets] = useState<{ text: string; tags: string[] }>([
		{ text: "", tags: [] },
	]);

	const existingTags = useMemo(() => {
		const tagsSet = new Set<string>();
		experiences.forEach((exp) => {
			exp.employer.experience.forEach((bullet) => {
				bullet.technologies?.forEach((tech) => {
					if (tech.name) tagsSet.add(tech.name);
				});
			});
		});
		return Array.from(tagsSet).sort();
	}, [experiences]);

	const showStatus = (type: "success" | "error", text: string) => {
		setStatusMessage({ type, text });
		setTimeout(() => {
			setStatusMessage(null);
		}, 4000);
	};

	const handleOpenAdd = () => {
		setEditingExperience(null);
		setCompanyName("");
		setJobTitle("");
		setStartDate(null);
		setEndDate(null);
		setIsPresent(false);
		setBullets([{ text: "", tags: [] }]);
		setOpened(true);
	};

	const handleOpenEdit = (exp: ExperienceRecord) => {
		setEditingExperience(exp);
		setCompanyName(exp.employer.name);
		setJobTitle(exp.employer.jobTitle);

		const parsedStart = new Date(exp.employer.startDate);
		setStartDate(!Number.isNaN(parsedStart.getTime()) ? parsedStart : null);

		if (exp.employer.endDate && exp.employer.endDate !== "Present") {
			const parsedEnd = new Date(exp.employer.endDate);
			setEndDate(!Number.isNaN(parsedEnd.getTime()) ? parsedEnd : null);
		} else {
			setEndDate(null);
		}
		setIsPresent(!exp.employer.endDate || exp.employer.endDate === "Present");
		setBullets(
			exp.employer.experience.map((item) => ({
				text: item.text,
				tags: item.technologies?.map((tech) => tech.name) || [],
			})),
		);
		setOpened(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formattedStartDate = startDate
			? dayjs(startDate).format("MMMM YYYY")
			: "";
		const formattedEndDate = endDate ? dayjs(endDate).format("MMMM YYYY") : "";

		if (!jobTitle.trim() || !formattedStartDate) {
			showStatus("error", "Job Title and Start Date are required.");
			return;
		}

		const filteredBullets: ExperienceItem[] = bullets
			.filter((b) => b.text.trim() !== "")
			.map((b) => ({
				text: b.text,
				technologies: b.tags
					.map((tag) => tag.trim())
					.filter((tag) => tag !== "")
					.map((tag) => ({
						name: tag,
						description: "",
						tags: [tag],
					})),
			}));

		if (filteredBullets.length === 0) {
			showStatus("error", "At least one responsibility bullet is required.");
			return;
		}

		const employer = {
			name: companyName,
			jobTitle,
			startDate: formattedStartDate,
			endDate: isPresent ? "Present" : formattedEndDate || null,
			experience: filteredBullets,
		};

		try {
			if (editingExperience) {
				await updateMutation.mutateAsync({
					id: editingExperience.id,
					employer,
				});
				showStatus("success", "Experience updated successfully!");
			} else {
				await createMutation.mutateAsync({
					employer,
				});
				showStatus("success", "Experience added successfully!");
			}
			setOpened(false);
		} catch (err) {
			showStatus(
				"error",
				err instanceof Error ? err.message : "Failed to save experience.",
			);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this experience?")) {
			try {
				await deleteMutation.mutateAsync(id);
				showStatus("success", "Experience deleted successfully!");
			} catch (err) {
				showStatus(
					"error",
					err instanceof Error ? err.message : "Failed to delete experience.",
				);
			}
		}
	};

	return (
		<Stack gap="xl">
			<Group justify="space-between" align="center">
				<Text size="sm" c="var(--sea-ink-soft)">
					Manage your work experience history.
				</Text>
				<Button
					leftSection={<Plus size={16} />}
					radius="xl"
					onClick={handleOpenAdd}
					color="blue"
				>
					Add Experience
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

			{/* Experiences List */}
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
							Failed to load experiences from API.
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
			) : experiences.length === 0 ? (
				<Card shadow="sm" radius="lg" className="island-shell" p="xl">
					<Stack align="center" py="xl" gap="md">
						<Briefcase size={40} className="text-gray-400" />
						<Text c="dimmed" fw={500}>
							No experience items found.
						</Text>
						<Button variant="light" onClick={handleOpenAdd}>
							Add your first experience
						</Button>
					</Stack>
				</Card>
			) : (
				<SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
					{experiences.map((exp) => {
						const job = exp.employer;
						const period = `${job.startDate} - ${job.endDate || "Present"}`;
						return (
							<Card
								key={exp.id}
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
								<Stack gap="md" style={{ flexGrow: 1 }}>
									<Group justify="space-between" align="flex-start">
										<div>
											<Title order={3} size="h5" c="var(--sea-ink)">
												{job.jobTitle}
											</Title>
											<Text size="sm" fw={500} c="var(--lagoon-deep)">
												{job.name || "Self-Employed / Independent"}
											</Text>
											<Text size="xs" c="var(--sea-ink-soft)">
												{period}
											</Text>
										</div>
										<Badge variant="light" color="blue">
											ID: {exp.id.slice(0, 8)}
										</Badge>
									</Group>

									<List size="sm" c="var(--sea-ink-soft)" spacing="xs">
										{job.experience.map((item, idx) => (
											<ListItem key={idx}>
												<Text size="sm">{item.text}</Text>
												{item.technologies && item.technologies.length > 0 && (
													<Group gap={4} mt={4}>
														{item.technologies.map((tech, tIdx) => (
															<Badge
																key={tIdx}
																variant="outline"
																size="xs"
																color="gray"
															>
																{tech.name}
															</Badge>
														))}
													</Group>
												)}
											</ListItem>
										))}
									</List>
								</Stack>

								<Group gap="sm" mt="xl" justify="flex-end">
									<Button
										variant="light"
										color="blue"
										size="xs"
										leftSection={<Edit size={12} />}
										onClick={() => handleOpenEdit(exp)}
									>
										Edit
									</Button>
									<Button
										variant="light"
										color="red"
										size="xs"
										leftSection={<Trash2 size={12} />}
										onClick={() => handleDelete(exp.id)}
									>
										Delete
									</Button>
								</Group>
							</Card>
						);
					})}
				</SimpleGrid>
			)}

			{/* Add/Edit Modal */}
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={editingExperience ? "Edit Experience" : "Add Experience"}
				size="lg"
				radius="md"
			>
				<form onSubmit={handleSubmit}>
					<Stack gap="md">
						<TextInput
							label="Job Title"
							placeholder="e.g. Senior Software Engineer"
							required
							value={jobTitle}
							onChange={(e) => setJobTitle(e.currentTarget.value)}
						/>

						<TextInput
							label="Company Name"
							placeholder="e.g. Wellmark"
							value={companyName}
							onChange={(e) => setCompanyName(e.currentTarget.value)}
						/>

						<SimpleGrid cols={2}>
							<MonthPickerInput
								label="Start Date"
								placeholder="Pick date"
								required
								value={startDate}
								onChange={(val: any) => setStartDate(val)}
							/>
							<Stack gap="xs" justify="flex-end">
								<MonthPickerInput
									label="End Date"
									placeholder="Pick date"
									disabled={isPresent}
									value={endDate}
									onChange={(val: any) => setEndDate(val)}
								/>
								<Checkbox
									label="Currently working here (Present)"
									checked={isPresent}
									onChange={(e) => setIsPresent(e.currentTarget.checked)}
								/>
							</Stack>
						</SimpleGrid>

						<Box>
							<Text size="sm" fw={500} mb="xs">
								Responsibilities & Technologies *
							</Text>
							<Stack gap="md">
								{bullets.map((bullet, index) => (
									<Card key={index} withBorder p="sm" radius="md">
										<Group justify="space-between" mb="xs">
											<Text size="xs" fw={700} c="dimmed">
												Bullet Point #{index + 1}
											</Text>
											<ActionIcon
												color="red"
												variant="light"
												disabled={bullets.length === 1}
												onClick={() => {
													const newBullets = [...bullets];
													newBullets.splice(index, 1);
													setBullets(
														newBullets.length > 0
															? newBullets
															: [{ text: "", tags: [] }],
													);
												}}
												size="sm"
											>
												<Trash2 size={12} />
											</ActionIcon>
										</Group>
										<Stack gap="xs">
											<Textarea
												placeholder={`Bullet Point Text #${index + 1}`}
												value={bullet.text}
												onChange={(e) => {
													const newBullets = [...bullets];
													newBullets[index] = {
														...newBullets[index],
														text: e.currentTarget.value,
													};
													setBullets(newBullets);
												}}
												autosize
												minRows={2}
												required={index === 0}
											/>
											<TagsInput
												placeholder="Technologies/Tags (e.g. React, Azure)"
												label="Tags (Optional)"
												size="sm"
												data={existingTags}
												clearable
												searchable
												value={bullet.tags}
												onChange={(value) => {
													const newBullets = [...bullets];
													newBullets[index] = {
														...newBullets[index],
														tags: value,
													};
													setBullets(newBullets);
												}}
											/>
										</Stack>
									</Card>
								))}
							</Stack>
							<Button
								variant="subtle"
								size="xs"
								leftSection={<Plus size={12} />}
								mt="sm"
								onClick={() => setBullets([...bullets, { text: "", tags: [] }])}
							>
								Add Bullet Point
							</Button>
						</Box>

						<Group justify="flex-end" mt="md">
							<Button variant="default" onClick={() => setOpened(false)}>
								Cancel
							</Button>
							<Button
								type="submit"
								color="blue"
								loading={createMutation.isPending || updateMutation.isPending}
							>
								{editingExperience ? "Save Changes" : "Create"}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}

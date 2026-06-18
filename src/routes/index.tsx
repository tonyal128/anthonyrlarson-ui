import {
	Affix,
	Badge,
	Box,
	Button,
	Card,
	CloseButton,
	Container,
	Drawer,
	Group,
	List,
	ListItem,
	SegmentedControl,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import {
	Award,
	Briefcase,
	ExternalLink,
	Filter,
	GraduationCap,
	Printer,
	Search,
	Wrench,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	useCertificationsQuery,
	useEducationQuery,
} from "../hooks/useEducationCertifications";
import { useExperiencesQuery } from "../hooks/useExperiences";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
	const {
		data: experiences = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useExperiencesQuery();
	const { data: educations = [] } = useEducationQuery();
	const { data: certifications = [] } = useCertificationsQuery();
	const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterMode, setFilterMode] = useState<"highlight" | "hide">(
		"highlight",
	);
	const [drawerOpened, setDrawerOpened] = useState(false);
	const [showAllSkills, setShowAllSkills] = useState(false);
	const VISIBLE_SKILLS_LIMIT = 12;

	// 1. Calculate derived skills from experience tags
	const derivedSkills = Array.from(
		new Set(
			experiences.flatMap((exp) =>
				exp.employer.experience.flatMap(
					(bullet) => bullet.technologies?.map((tech) => tech.name) || [],
				),
			),
		),
	).sort((a, b) => a.localeCompare(b));

	const skillsToDisplay = searchQuery.trim()
		? derivedSkills.filter((skill) =>
				skill.toLowerCase().includes(searchQuery.trim().toLowerCase()),
			)
		: derivedSkills;

	// 2. Filter experiences by search query and selected skill
	const filteredExperiences = experiences.filter((exp) => {
		const job = exp.employer;
		const queryLower = searchQuery.trim().toLowerCase();

		let matchesSearch = true;
		if (queryLower) {
			const titleMatch = job.jobTitle.toLowerCase().includes(queryLower);
			const companyMatch = job.name.toLowerCase().includes(queryLower);
			const bulletMatch = job.experience.some(
				(bullet) =>
					bullet.text.toLowerCase().includes(queryLower) ||
					bullet.technologies?.some((tech) =>
						tech.name.toLowerCase().includes(queryLower),
					),
			);
			matchesSearch = titleMatch || companyMatch || bulletMatch;
		}

		let matchesSkill = true;
		if (selectedSkill) {
			const skillLower = selectedSkill.toLowerCase();
			const titleMatch = job.jobTitle.toLowerCase().includes(skillLower);
			const companyMatch = job.name.toLowerCase().includes(skillLower);
			const bulletMatch = job.experience.some(
				(bullet) =>
					bullet.text.toLowerCase().includes(skillLower) ||
					bullet.technologies?.some(
						(tech) =>
							tech.name.toLowerCase().includes(skillLower) ||
							tech.tags.some((tag) => tag.toLowerCase().includes(skillLower)),
					),
			);
			matchesSkill = titleMatch || companyMatch || bulletMatch;
		}

		return matchesSearch && matchesSkill;
	});

	const renderFilters = () => (
		<Stack gap="md">
			<TextInput
				placeholder="Search jobs, bullets, skills..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.currentTarget.value)}
				leftSection={<Search size={16} />}
				rightSection={
					searchQuery ? (
						<CloseButton
							aria-label="Clear input"
							onClick={() => setSearchQuery("")}
							size="sm"
						/>
					) : null
				}
			/>
			<Group justify="space-between" align="center">
				<Text size="xs" fw={500} c="var(--sea-ink-soft)">
					Filter Mode:
				</Text>
				<SegmentedControl
					size="xs"
					value={filterMode}
					onChange={(val) => setFilterMode(val as "highlight" | "hide")}
					data={[
						{ label: "Highlight", value: "highlight" },
						{ label: "Hide Others", value: "hide" },
					]}
				/>
			</Group>

			<Group gap="xs" mt="xs">
				{skillsToDisplay.length === 0 ? (
					<Text
						size="sm"
						c="var(--sea-ink-soft)"
						fs="italic"
						w="100%"
						ta="center"
					>
						No skills found. Add technologies to your experiences to see them
						here.
					</Text>
				) : (
					<>
						{(showAllSkills
							? skillsToDisplay
							: skillsToDisplay.slice(0, VISIBLE_SKILLS_LIMIT)
						).map((skill) => {
							const isActive = selectedSkill === skill;
							return (
								<Badge
									key={skill}
									variant={isActive ? "filled" : "light"}
									color="blue"
									size="lg"
									radius="sm"
									style={{ cursor: "pointer", transition: "all 0.2s ease" }}
									onClick={() => setSelectedSkill(isActive ? null : skill)}
								>
									{skill}
								</Badge>
							);
						})}
						{skillsToDisplay.length > VISIBLE_SKILLS_LIMIT && (
							<Button
								variant="subtle"
								size="xs"
								onClick={() => setShowAllSkills(!showAllSkills)}
								style={{ padding: "0 8px" }}
							>
								{showAllSkills
									? "Show Less"
									: `+${skillsToDisplay.length - VISIBLE_SKILLS_LIMIT} More`}
							</Button>
						)}
					</>
				)}
			</Group>

			{(selectedSkill || searchQuery) && (
				<Button
					variant="subtle"
					size="xs"
					leftSection={<X size={12} />}
					onClick={() => {
						setSelectedSkill(null);
						setSearchQuery("");
					}}
					mt="xs"
				>
					Reset Filters
				</Button>
			)}
		</Stack>
	);
	return (
		<Container size="lg" py="xl" className="page-wrap">
			{/* Hero Section */}
			<Card
				radius="xl"
				p={{ base: "xl", sm: 40 }}
				className="island-shell rise-in relative overflow-hidden"
				mb="xl"
			>
				<Stack align="flex-start" gap="md" pos="relative" style={{ zIndex: 1 }}>
					<Text
						tt="uppercase"
						fw={700}
						lts="0.16em"
						size="xs"
						c="var(--kicker)"
						className="island-kicker m-0"
					>
						Software Engineer
					</Text>
					<Title
						order={1}
						className="display-title m-0"
						c="var(--sea-ink)"
						style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.05 }}
					>
						Anthony Larson
					</Title>
					<Group gap="sm" mb="xs">
						<Badge variant="light" color="blue" size="lg" radius="sm">
							West Des Moines, IA
						</Badge>
					</Group>
					<Text
						size="lg"
						c="var(--sea-ink-soft)"
						maw={800}
						className="m-0"
						lh={1.6}
					>
						Tech Lead with proven experience in modernization, architecture, and
						mentorship. Always learning and growing, open to working in any
						programming language or environment.
					</Text>
					<Group mt="md">
						<Button
							component="a"
							href="#experience"
							radius="xl"
							size="md"
							variant="light"
							color="blue"
						>
							View Experience
						</Button>
						<Button
							component="a"
							href="https://linkedin.com/in/anthonyrlarson"
							target="_blank"
							radius="xl"
							size="md"
							variant="default"
						>
							Connect on LinkedIn
						</Button>
						<Button
							onClick={() => window.print()}
							radius="xl"
							size="md"
							variant="outline"
							color="blue"
							leftSection={<Printer size={18} />}
							className="no-print"
						>
							Export as Resume
						</Button>
					</Group>
				</Stack>
			</Card>

			<SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
				<Stack className="md:col-span-2" gap="xl">
					{/* Experience Section */}
					<section id="experience" className="scroll-mt-24">
						<Group mb="xl" wrap="nowrap">
							<ThemeIcon size="lg" variant="light" color="blue" radius="md">
								<Briefcase size={20} suppressHydrationWarning />
							</ThemeIcon>
							<Title order={2} c="var(--sea-ink)">
								Work Experience
							</Title>
						</Group>

						<Stack gap="xl">
							{isLoading &&
								[1, 2, 3].map((n) => (
									<Card
										key={n}
										shadow="sm"
										radius="lg"
										className="island-shell"
										p="xl"
									>
										<Skeleton height={24} width="60%" mb="md" />
										<Skeleton height={16} width="40%" mb="xl" />
										<Stack gap="xs">
											<Skeleton height={12} width="95%" />
											<Skeleton height={12} width="90%" />
											<Skeleton height={12} width="85%" />
										</Stack>
									</Card>
								))}

							{isError && (
								<Card
									shadow="sm"
									radius="lg"
									className="island-shell"
									p="xl"
									style={{ border: "1px solid var(--mantine-color-red-light)" }}
								>
									<Stack align="flex-start" gap="md">
										<Text c="red" fw={600}>
											Failed to load work experiences.
										</Text>
										<Text size="sm" c="dimmed">
											{error instanceof Error
												? error.message
												: "Unknown error occurred"}
										</Text>
										<Button
											size="xs"
											color="red"
											variant="light"
											onClick={() => refetch()}
										>
											Retry
										</Button>
									</Stack>
								</Card>
							)}

							{!isLoading && !isError && experiences.length === 0 && (
								<Card shadow="sm" radius="lg" className="island-shell" p="xl">
									<Text c="var(--sea-ink-soft)" ta="center" fs="italic">
										No work experiences have been added yet.
									</Text>
								</Card>
							)}

							{!isLoading &&
								!isError &&
								filterMode === "hide" &&
								filteredExperiences.length === 0 && (
									<Card shadow="sm" radius="lg" className="island-shell" p="xl">
										<Text c="dimmed" ta="center">
											No matching experiences for the selected filters.
										</Text>
									</Card>
								)}

							{!isLoading &&
								!isError &&
								(filterMode === "highlight"
									? experiences
									: filteredExperiences
								).map((exp, index) => {
									const job = exp.employer;
									const period = `${job.startDate} - ${job.endDate || "Present"}`;

									// Determine if this experience matches the active filter criteria
									const isMatched = filteredExperiences.some(
										(f) => f.id === exp.id,
									);
									const hasActiveFilter = !!(
										selectedSkill || searchQuery.trim()
									);

									return (
										<Card
											key={exp.id}
											shadow="sm"
											radius="lg"
											className="island-shell feature-card rise-in"
											style={{
												animationDelay: `${index * 90 + 80}ms`,
												transition: "all 0.3s ease",
												opacity: hasActiveFilter && !isMatched ? 0.35 : 1,
												transform:
													hasActiveFilter && isMatched
														? "scale(1.015)"
														: "scale(1)",
												border:
													hasActiveFilter && isMatched
														? "2px solid var(--mantine-color-blue-filled)"
														: "1px solid transparent",
												boxShadow:
													hasActiveFilter && isMatched
														? "0 8px 30px rgba(34, 139, 230, 0.15)"
														: undefined,
											}}
											p="xl"
										>
											<Title order={3} size="h5" c="var(--sea-ink)" mb={4}>
												{job.jobTitle}
											</Title>
											<Text size="sm" fw={500} c="var(--lagoon-deep)" mb="md">
												{job.name ? `${job.name} • ` : ""}
												{period}
											</Text>
											<List
												size="sm"
												c="var(--sea-ink-soft)"
												spacing="xs"
												className="leading-relaxed"
											>
												{job.experience.map((bullet, idx) => {
													let matchesSearch = true;
													if (searchQuery.trim()) {
														const queryLower = searchQuery.trim().toLowerCase();
														const textMatch = bullet.text
															.toLowerCase()
															.includes(queryLower);
														const techMatch = bullet.technologies?.some(
															(tech) =>
																tech.name.toLowerCase().includes(queryLower),
														);
														matchesSearch = textMatch || (techMatch ?? false);
													}

													let matchesSkill = true;
													if (selectedSkill) {
														const skillLower = selectedSkill.toLowerCase();
														const textMatch = bullet.text
															.toLowerCase()
															.includes(skillLower);
														const techMatch = bullet.technologies?.some(
															(tech) =>
																tech.name.toLowerCase().includes(skillLower) ||
																tech.tags.some((tag) =>
																	tag.toLowerCase().includes(skillLower),
																),
														);
														matchesSkill = textMatch || (techMatch ?? false);
													}

													const isBulletMatched = matchesSearch && matchesSkill;
													const hasActiveFilter = !!(
														selectedSkill || searchQuery.trim()
													);

													return (
														<ListItem
															key={bullet.text + idx}
															style={{
																transition: "all 0.2s ease",
																opacity:
																	hasActiveFilter && !isBulletMatched ? 0.3 : 1,
															}}
														>
															<Text
																size="sm"
																fw={
																	hasActiveFilter && isBulletMatched ? 600 : 400
																}
																c={
																	hasActiveFilter && isBulletMatched
																		? "var(--sea-ink)"
																		: undefined
																}
																style={{ display: "inline" }}
															>
																{bullet.text}
															</Text>
															{bullet.technologies?.some(
																(tech) =>
																	selectedSkill?.toLowerCase() ===
																		tech.name.toLowerCase() ||
																	(searchQuery.trim() &&
																		tech.name
																			.toLowerCase()
																			.includes(
																				searchQuery.trim().toLowerCase(),
																			)),
															) && (
																<Group gap={4} mt={4}>
																	{bullet.technologies
																		.filter(
																			(tech) =>
																				selectedSkill?.toLowerCase() ===
																					tech.name.toLowerCase() ||
																				(searchQuery.trim() &&
																					tech.name
																						.toLowerCase()
																						.includes(
																							searchQuery.trim().toLowerCase(),
																						)),
																		)
																		.map((tech, tIdx) => (
																			<Badge
																				key={tIdx}
																				variant="filled"
																				size="xs"
																				color="blue"
																			>
																				{tech.name}
																			</Badge>
																		))}
																</Group>
															)}
														</ListItem>
													);
												})}
											</List>
										</Card>
									);
								})}
						</Stack>
					</section>
				</Stack>

				<Stack
					gap="xl"
					style={{ position: "sticky", top: "100px", alignSelf: "start" }}
				>
					{/* Skills Section */}
					<Box visibleFrom="md" className="no-print">
						<section id="skills" className="scroll-mt-24">
							<Group mb="xl" wrap="nowrap">
								<ThemeIcon size="lg" variant="light" color="blue" radius="md">
									<Wrench size={20} suppressHydrationWarning />
								</ThemeIcon>
								<Title order={2} c="var(--sea-ink)">
									Skills
								</Title>
							</Group>

							<Card
								shadow="sm"
								radius="lg"
								className="island-shell rise-in"
								p="xl"
							>
								{renderFilters()}
							</Card>
						</section>
					</Box>

					{/* Education Section */}
					<section id="education" className="scroll-mt-24">
						<Group mb="xl" wrap="nowrap">
							<ThemeIcon size="lg" variant="light" color="blue" radius="md">
								<GraduationCap size={20} suppressHydrationWarning />
							</ThemeIcon>
							<Title order={2} c="var(--sea-ink)">
								Education
							</Title>
						</Group>

						<Stack gap="md">
							{educations.length === 0 ? (
								<Card shadow="sm" radius="lg" className="island-shell" p="xl">
									<Text
										size="sm"
										c="var(--sea-ink-soft)"
										ta="center"
										fs="italic"
									>
										No education history has been added yet.
									</Text>
								</Card>
							) : (
								educations.map((edu) => (
									<Card
										key={edu.id}
										shadow="sm"
										radius="lg"
										className="island-shell rise-in"
										p="xl"
									>
										<Title order={3} size="h5" c="var(--sea-ink)" mb={4}>
											{edu.degree}
										</Title>
										<Text size="sm" fw={500} c="var(--lagoon-deep)" mb="xs">
											{edu.institution}
										</Text>
										<Text
											size="sm"
											c="var(--sea-ink-soft)"
											mb={edu.description ? "xs" : undefined}
										>
											{edu.period}
										</Text>
										{edu.description && (
											<Text size="sm" c="var(--sea-ink-soft)">
												{edu.description}
											</Text>
										)}
									</Card>
								))
							)}
						</Stack>
					</section>

					{/* Certifications Section */}
					<section
						id="certifications"
						className="scroll-mt-24"
						style={{ marginTop: "24px" }}
					>
						<Group mb="xl" wrap="nowrap">
							<ThemeIcon size="lg" variant="light" color="blue" radius="md">
								<Award size={20} suppressHydrationWarning />
							</ThemeIcon>
							<Title order={2} c="var(--sea-ink)">
								Certifications
							</Title>
						</Group>

						<Stack gap="md">
							{certifications.length === 0 ? (
								<Card shadow="sm" radius="lg" className="island-shell" p="xl">
									<Text
										size="sm"
										c="var(--sea-ink-soft)"
										ta="center"
										fs="italic"
									>
										No certifications have been added yet.
									</Text>
								</Card>
							) : (
								certifications.map((cert) => (
									<Card
										key={cert.id}
										shadow="sm"
										radius="lg"
										className="island-shell rise-in"
										p="xl"
									>
										<Title order={3} size="h5" c="var(--sea-ink)" mb={4}>
											{cert.name}
										</Title>
										<Text size="sm" fw={500} c="var(--lagoon-deep)">
											{cert.issuer}
										</Text>
										<Text size="xs" c="var(--sea-ink-soft)">
											Issued in {cert.issueDate}
										</Text>
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
									</Card>
								))
							)}
						</Stack>
					</section>
				</Stack>
			</SimpleGrid>
			<Drawer
				opened={drawerOpened}
				onClose={() => setDrawerOpened(false)}
				title={
					<Title order={3} c="var(--sea-ink)">
						Filters & Skills
					</Title>
				}
				position="bottom"
				size="80%"
				hiddenFrom="md"
				radius="md"
				className="no-print"
			>
				{renderFilters()}
			</Drawer>

			<Affix
				position={{ bottom: 20, right: 20 }}
				hiddenFrom="md"
				className="no-print"
			>
				<Button
					leftSection={<Filter size={16} />}
					radius="xl"
					size="md"
					onClick={() => setDrawerOpened(true)}
				>
					Filters {selectedSkill || searchQuery ? "(Active)" : ""}
				</Button>
			</Affix>
		</Container>
	);
}

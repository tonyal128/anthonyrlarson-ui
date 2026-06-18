import { Container, Stack, Tabs, Text, Title } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { useState } from "react";
import CertificationsTab from "../components/admin/CertificationsTab";
import EducationTab from "../components/admin/EducationTab";
import ExperienceTab from "../components/admin/ExperienceTab";

export const Route = createFileRoute("/admin")({
	beforeLoad: async ({ location }) => {
		if (typeof window === "undefined") return;

		try {
			const session = await fetchAuthSession();
			if (!session.tokens) {
				throw redirect({
					to: "/login",
					search: {
						redirect: location.href,
					},
				});
			}
		} catch (e) {
			if (e instanceof Error && e.name === "RedirectError") throw e;
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AdminDashboard,
});

function AdminDashboard() {
	const [activeTab, setActiveTab] = useState<string | null>("experience");

	return (
		<Container size="lg" py="xl" className="page-wrap">
			<Stack gap="xl">
				{/* Header Actions */}
				<Stack gap={4}>
					<Title order={1} c="var(--sea-ink)">
						Admin Dashboard
					</Title>
					<Text size="sm" c="var(--sea-ink-soft)">
						Manage all your portfolio sections including Work Experience,
						Education, and Certifications.
					</Text>
				</Stack>

				<Tabs
					value={activeTab}
					onChange={setActiveTab}
					variant="outline"
					radius="md"
				>
					<Tabs.List mb="lg">
						<Tabs.Tab value="experience" leftSection={<Briefcase size={16} />}>
							Work Experience
						</Tabs.Tab>
						<Tabs.Tab
							value="education"
							leftSection={<GraduationCap size={16} />}
						>
							Education
						</Tabs.Tab>
						<Tabs.Tab value="certifications" leftSection={<Award size={16} />}>
							Certifications
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="experience">
						<ExperienceTab />
					</Tabs.Panel>

					<Tabs.Panel value="education">
						<EducationTab />
					</Tabs.Panel>

					<Tabs.Panel value="certifications">
						<CertificationsTab />
					</Tabs.Panel>
				</Tabs>
			</Stack>
		</Container>
	);
}

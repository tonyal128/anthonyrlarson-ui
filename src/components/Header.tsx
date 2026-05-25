import { useAuthenticator } from "@aws-amplify/ui-react";
import {
	ActionIcon,
	Anchor,
	Box,
	Group,
	Image,
	UnstyledButton,
} from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const { authStatus, signOut } = useAuthenticator((context) => [
		context.authStatus,
	]);
	const navigate = useNavigate();

	return (
		<Box
			component="header"
			className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg"
		>
			<nav className="page-wrap">
				<Group justify="space-between" py="xs" gap="md">
					<Group gap="md">
						<UnstyledButton
							component={Link}
							to="/"
							className="flex items-center justify-center rounded-full border border-(--chip-line) bg-(--chip-bg) p-1 transition hover:bg-(--link-bg-hover)"
						>
							<Image
								src="/favicon.png"
								alt="Anthony Larson"
								w={32}
								h={32}
								radius="xl"
							/>
						</UnstyledButton>

						<Group gap="lg" visibleFrom="xs">
							<Anchor
								component={Link}
								to="/"
								className="nav-link"
								activeProps={{ className: "nav-link is-active" }}
								activeOptions={{ exact: true }}
								underline="never"
								size="sm"
								fw={600}
							>
								Home
							</Anchor>
							<Anchor
								href="/#experience"
								className="nav-link"
								underline="never"
								size="sm"
								fw={600}
							>
								Experience
							</Anchor>
							<Anchor
								href="/#projects"
								className="nav-link"
								underline="never"
								size="sm"
								fw={600}
							>
								Projects
							</Anchor>
							{authStatus === "authenticated" && (
								<Anchor
									component={Link}
									to="/admin"
									className="nav-link"
									activeProps={{ className: "nav-link is-active" }}
									underline="never"
									size="sm"
									fw={600}
								>
									Admin
								</Anchor>
							)}
						</Group>
					</Group>

					<Group gap="md">
						<Group gap="xs" visibleFrom="sm">
							<ActionIcon
								component="a"
								href="https://github.com/tonyal128"
								target="_blank"
								variant="subtle"
								color="var(--sea-ink-soft)"
								radius="xl"
								size="lg"
								className="hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
								aria-label="GitHub"
							>
								<svg viewBox="0 0 16 16" width="20" height="20" role="img">
									<title>GitHub</title>
									<path
										fill="currentColor"
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
									/>
								</svg>
							</ActionIcon>
							<ActionIcon
								component="a"
								href="https://linkedin.com/in/anthonyrlarson"
								target="_blank"
								variant="subtle"
								color="var(--sea-ink-soft)"
								radius="xl"
								size="lg"
								className="hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
								aria-label="LinkedIn"
							>
								<svg viewBox="0 0 24 24" width="20" height="20" role="img">
									<title>LinkedIn</title>
									<path
										fill="currentColor"
										d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									/>
								</svg>
							</ActionIcon>
						</Group>

						<ThemeToggle />

						{authStatus === "authenticated" ? (
							<UnstyledButton
								type="button"
								onClick={() => {
									signOut();
									navigate({ to: "/" });
								}}
								className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-xs font-semibold text-(--sea-ink) shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition hover:bg-(--link-bg-hover) sm:px-4 sm:py-2 sm:text-sm"
							>
								Sign Out
							</UnstyledButton>
						) : (
							<UnstyledButton
								component={Link}
								to="/login"
								className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-xs font-semibold text-(--sea-ink) shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition hover:bg-(--link-bg-hover) sm:px-4 sm:py-2 sm:text-sm"
							>
								Login
							</UnstyledButton>
						)}
					</Group>
				</Group>
			</nav>
		</Box>
	);
}

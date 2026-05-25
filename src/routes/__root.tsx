import {
	Button,
	Container,
	MantineProvider,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";

import PostHogProvider from "../integrations/posthog/provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import "@mantine/core/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

import { Amplify } from "aws-amplify";
import appCss from "/src/styles.css?url";
import "@aws-amplify/ui-react/styles.css";
import { amplifyConfig } from "../amplify-config";

Amplify.configure(amplifyConfig);

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Anthony Larson - Software Engineer",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: () => (
		<RootDocument>
			<Outlet />
		</RootDocument>
	),
	notFoundComponent: () => (
		<Container py="xl">
			<Stack align="center" gap="md">
				<Title order={1}>404 - Page Not Found</Title>
				<Text>The page you are looking for does not exist.</Text>
				<Button component="a" href="/">
					Go Home
				</Button>
			</Stack>
		</Container>
	),
	errorComponent: ({ error }: { error: Error }) => (
		<Container py="xl">
			<Stack align="center" gap="md">
				<Title order={1}>Something went wrong</Title>
				<Text c="red">{error?.message || "An unexpected error occurred"}</Text>
				<Button onClick={() => window.location.reload()}>Reload Page</Button>
			</Stack>
		</Container>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional blocking script to prevent theme flash */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body
				className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]"
				suppressHydrationWarning
			>
				<MantineProvider defaultColorScheme="auto">
					<Authenticator.Provider>
						<PostHogProvider>
							<Header />
							{children}
							<Footer />
							<TanStackDevtools
								config={{
									position: "bottom-right",
								}}
								plugins={[
									{
										name: "Tanstack Router",
										render: <TanStackRouterDevtoolsPanel />,
									},
									TanStackQueryDevtools,
								]}
							/>
						</PostHogProvider>
					</Authenticator.Provider>
				</MantineProvider>
				<Scripts />
			</body>
		</html>
	);
}

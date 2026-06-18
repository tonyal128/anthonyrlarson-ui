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
import "@mantine/dates/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";

import { Amplify } from "aws-amplify";
import appCss from "/src/styles.css?url";
import "@aws-amplify/ui-react/styles.css";
import { amplifyConfig } from "../amplify-config";

Amplify.configure(amplifyConfig);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
		<div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
			<h1 className="text-3xl font-bold mb-4 text-[var(--sea-ink)]">404 - Page Not Found</h1>
			<p className="text-[var(--sea-ink-soft)] mb-6">The page you are looking for does not exist.</p>
			<a
				href="/"
				className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
			>
				Go Home
			</a>
		</div>
	),
	errorComponent: ({ error }: { error: Error }) => (
		<div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
			<h1 className="text-3xl font-bold mb-4 text-[var(--sea-ink)]">Something went wrong</h1>
			<p className="text-red-600 font-semibold mb-2">{error?.message || "An unexpected error occurred"}</p>
			<p className="text-sm text-[var(--sea-ink-soft)] mb-6">Check client logs/console for details.</p>
			<button
				onClick={() => window.location.reload()}
				className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition cursor-pointer"
			>
				Reload Page
			</button>
		</div>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();
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
					<QueryClientProvider client={queryClient}>
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
					</QueryClientProvider>
				</MantineProvider>
				<Scripts />
			</body>
		</html>
	);
}

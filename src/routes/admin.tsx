import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";

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
	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
			<p className="text-lg text-gray-600 dark:text-gray-400">
				Welcome to the admin area. You are successfully authenticated.
			</p>
		</div>
	);
}

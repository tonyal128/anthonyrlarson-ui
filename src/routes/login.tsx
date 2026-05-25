import { Authenticator } from "@aws-amplify/ui-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ search }) => {
		if (typeof window === "undefined") return;

		try {
			const session = await fetchAuthSession();
			if (session.tokens) {
				throw redirect({
					to: (search as { redirect?: string }).redirect || "/admin",
				});
			}
		} catch (_e) {
			// Not logged in
		}
	},
	component: LoginComponent,
});

function LoginComponent() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
			<Authenticator />
		</div>
	);
}

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
	const { authStatus } = useAuthenticator((context) => [context.authStatus]);
	const navigate = useNavigate();
	const search = Route.useSearch();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (isMounted && authStatus === "authenticated") {
			const redirectTo = (search as { redirect?: string }).redirect || "/admin";
			navigate({ to: redirectTo, replace: true });
		}
	}, [isMounted, authStatus, navigate, search]);

	if (!isMounted) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
			<Authenticator hideSignUp />
		</div>
	);
}

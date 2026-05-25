import { Box, Group, Stack, Text } from "@mantine/core";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<Box
			component="footer"
			className="mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)"
		>
			<Stack className="page-wrap" gap="lg">
				<Group justify="center" align="center" gap="md">
					<Text size="sm" m={0}>
						&copy; {year} Anthony Larson. All rights reserved.
					</Text>
				</Group>
			</Stack>
		</Box>
	);
}

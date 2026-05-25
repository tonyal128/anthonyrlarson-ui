import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, GraduationCap, Wrench } from "lucide-react";
import {
  Button,
  Card,
  Text,
  Title,
  Badge,
  Group,
  Stack,
  Container,
  SimpleGrid,
  ThemeIcon,
  List,
  ListItem,
} from "@mantine/core";

export const Route = createFileRoute("/")({ component: App });

function App() {
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
              href="https://linkedin.com/in/anthonylarson"
              target="_blank"
              radius="xl"
              size="md"
              variant="default"
            >
              Connect on LinkedIn
            </Button>
          </Group>
        </Stack>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
        <Stack className="md:col-span-2" gap="xl">
          {/* Experience Section */}
          <section id="experience" className="scroll-mt-24">
            <Group mb="xl">
              <ThemeIcon size="lg" variant="light" color="blue" radius="md">
                <Briefcase size={20} suppressHydrationWarning />
              </ThemeIcon>
              <Title order={2} c="var(--sea-ink)">
                Work Experience
              </Title>
            </Group>

            <Stack gap="xl">
              {[
                {
                  role: "Senior Software Engineer",
                  company: "Wellmark",
                  period: "February 2026 - Present",
                  bullets: [
                    "Working as a Senior Software Engineer contributing to modern web applications and system architecture.",
                  ],
                },
                {
                  role: "Tech Lead",
                  company: "Sammons Financial Group",
                  period: "2020 - 2026",
                  bullets: [
                    "Designed and built a data entry system from the ground up that utilizes Azure Document Intelligence to perform OCR on documents",
                    "Utilized Azure Service Bus and RabbitMQ for communicating events and processing in real time",
                    "Utilized OpenAI api to extract data from forms prior to sending it through Azure Document Intelligence",
                    "Built a UI for the data entry system using React, Tanstack Query, Tanstack Router, and Mantine",
                    "Built UI components for a workflow system using React, Tanstack Query, Redux, React Router, and Material UI",
                    "Built services and listeners for our data entry system and workflow system using NodeJS",
                    "Mentored other developers and QA automation engineers",
                    "Communicated with stakeholders, developers, QAs, and architects about system design, architecture decisions, progress, and challenges",
                    "Built out tests using Vitest, Jest, React Testing Library, Mocha, and Chai",
                    "Utilized MongoDB and MS SQL for data extraction",
                  ],
                },
                {
                  role: "Senior Software Engineer",
                  company: "Casey’s General Store",
                  period: "2019 - 2020",
                  bullets: [
                    "Led a modernization effort to move from WinForms to React",
                    "Led a modernization effort to move applications from VB.NET to .NET Core",
                    "Mentored other developers",
                    "Maintained and updated legacy systems that were on varying versions of .NET and VB.NET",
                    "Led an effort to introduce CI/CD to our normal deployment process using Azure DevOps",
                    "Built out stored procedures and tests for those stored procedures",
                    "Utilized MS SQL for data extraction",
                    "Created unit tests using xUnit",
                  ],
                },
                {
                  role: "Software Engineer",
                  company: "Shazam",
                  period: "2018 - 2019",
                  bullets: [
                    "Connected foreign processing network to Shazam using C++",
                    "Built and optimized tools for data extraction using C++ and Python",
                    "Utilized Python and Java to validate accurate processing",
                    "Created solutions for production defects",
                    "Created microservices to connect to various imaging providers",
                    "Utilized Flutter, React, and Java to build out a banking platform",
                    "Utilized MySQL to store and query data on our banking platform",
                  ],
                },
                {
                  role: "Business Application Specialist",
                  company: "",
                  period: "2013 - 2018",
                  bullets: [
                    "Developed a read only dashboard to monitor outbound dialing for multiple business units using jQuery, HTML, CSS, and Ajax",
                    "Designed a C# application that was used to format and sanitize raw files before use",
                    "Built queries using MS SQL",
                    "Built reports using SAP Business Objects and SAP Crystal Reports",
                    "Wrote test scripts and performed user acceptance testing for the automated dialer system",
                    "Train teammates in SQL",
                    "Created team standards for our reporting systems",
                    "Created documentation around our custom reports",
                  ],
                },
              ].map((job, index) => (
                <Card
                  key={job.role + job.company}
                  shadow="sm"
                  radius="lg"
                  className="island-shell feature-card rise-in"
                  style={{ animationDelay: `${index * 90 + 80}ms` }}
                  p="xl"
                >
                  <Title order={3} size="h5" c="var(--sea-ink)" mb={4}>
                    {job.role}
                  </Title>
                  <Text size="sm" fw={500} c="var(--lagoon-deep)" mb="md">
                    {job.company ? `${job.company} • ` : ""}
                    {job.period}
                  </Text>
                  <List
                    size="sm"
                    c="var(--sea-ink-soft)"
                    spacing="xs"
                    className="leading-relaxed"
                  >
                    {job.bullets.map((bullet) => (
                      <ListItem key={bullet}>{bullet}</ListItem>
                    ))}
                  </List>
                </Card>
              ))}
            </Stack>
          </section>
        </Stack>

        <Stack gap="xl">
          {/* Skills Section */}
          <section id="skills" className="scroll-mt-24">
            <Group mb="xl">
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
              <Group gap="xs">
                {[
                  "AWS",
                  "Azure",
                  "RabbitMQ",
                  "Kubernetes",
                  "Docker",
                  "React",
                  "JavaScript",
                  "MongoDB",
                  "NodeJS",
                  "TypeScript",
                  "C#",
                  ".NET",
                  "SQL",
                  "Python",
                ].map((skill) => (
                  <Badge
                    key={skill}
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </Group>
            </Card>
          </section>

          {/* Education Section */}
          <section id="education" className="scroll-mt-24">
            <Group mb="xl">
              <ThemeIcon size="lg" variant="light" color="blue" radius="md">
                <GraduationCap size={20} suppressHydrationWarning />
              </ThemeIcon>
              <Title order={2} c="var(--sea-ink)">
                Education
              </Title>
            </Group>

            <Card
              shadow="sm"
              radius="lg"
              className="island-shell rise-in"
              p="xl"
            >
              <Title order={3} size="h5" c="var(--sea-ink)" mb={4}>
                Associates in Applied Science
              </Title>
              <Text size="sm" fw={500} c="var(--lagoon-deep)" mb="xs">
                Des Moines Area Community College
              </Text>
              <Text size="sm" c="var(--sea-ink-soft)">
                Class of 2018
              </Text>
            </Card>
          </section>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}

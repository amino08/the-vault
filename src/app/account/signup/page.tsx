import { SignupForm } from "@/components/auth/signup-form";
import { Container, PageHeader, Section } from "@/components/layout/section";

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;

  return (
    <Section>
      <Container size="narrow">
        <PageHeader
          eyebrow="Client Portal"
          title="Create Account"
          description="Register to begin or track your commission."
        />
        <SignupForm nextPath={next} />
      </Container>
    </Section>
  );
}

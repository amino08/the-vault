import { LoginForm } from "@/components/auth/login-form";
import { Container, PageHeader, Section } from "@/components/layout/section";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <Section>
      <Container size="narrow">
        <PageHeader
          eyebrow="Client Portal"
          title="Sign In"
          description="Access your commissions, messages, and approvals."
        />
        <LoginForm nextPath={next} />
      </Container>
    </Section>
  );
}

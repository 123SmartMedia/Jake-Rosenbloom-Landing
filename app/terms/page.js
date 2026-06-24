export const metadata = { title: 'Terms of Use | Jake Rosenbloom – United Mortgage Corp.' };

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 22px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-jakarta, sans-serif)', color: 'var(--navy)' }}>Terms of Use</h1>
      <p style={{ color: 'var(--gray)', fontSize: 15 }}>
        This page is being updated. Please check back soon or{' '}
        <a href="mailto:placeholder@unitedmortgage.com">contact us</a> with any questions.
      </p>
      <p style={{ marginTop: 32 }}>
        <a href="/" style={{ color: 'var(--teal)', fontWeight: 600 }}>← Back to home</a>
      </p>
    </main>
  );
}

export const metadata = { title: 'Licensing | Jake Rosenbloom – United Mortgage Corp.' };

export default function LicensingPage() {
  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 22px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-jakarta, sans-serif)', color: 'var(--navy)' }}>Licensing</h1>
      <p style={{ color: 'var(--gray)', fontSize: 15 }}>
        Jake Rosenbloom, NMLS{' '}
        <a
          href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
          target="_blank"
          rel="noopener noreferrer"
        >
          #1284586
        </a>
        , is a licensed mortgage loan originator at United Mortgage Corp. (NMLS #1330), licensed in
        26 states. Full licensing details are available at{' '}
        <a
          href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
          target="_blank"
          rel="noopener noreferrer"
        >
          NMLS Consumer Access
        </a>.
      </p>
      <p style={{ color: 'var(--gray)', fontSize: 15 }}>
        Complete state licensing disclosures are being updated. Please check back soon.
      </p>
      <p style={{ marginTop: 32 }}>
        <a href="/" style={{ color: 'var(--teal)', fontWeight: 600 }}>← Back to home</a>
      </p>
    </main>
  );
}

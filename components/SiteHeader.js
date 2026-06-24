export default function SiteHeader() {
  const phone = process.env.NEXT_PUBLIC_JAKE_PHONE || '+10000000000';

  return (
    <header className="site">
      <div className="wrap">
        <div className="brand">
          <img
            src="/United-Mortgage-Color-Logo-200x200.png"
            alt="United Mortgage Corp."
            className="um-logo-header"
          />
          <div>
            <div className="name">Jake Rosenbloom</div>
            <div className="sub">Loan Officer · United Mortgage Corp.</div>
          </div>
        </div>
        <a href={`tel:${phone}`} className="hcall">
          <span>Questions?</span>
          Talk to Jake
        </a>
      </div>
    </header>
  );
}

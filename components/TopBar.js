export default function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <span>
          <strong>United Mortgage Corp.</strong> — Licensed Mortgage Lender &nbsp;|&nbsp;{' '}
          NMLS{' '}
          <a
            href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1284586"
            className="nmls-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            #1284586
          </a>
        </span>
        <span className="ehl">
          <img src="/ehl-logo.svg" alt="Equal Housing Lender" className="ehl-logo" />
          Equal Housing Lender
        </span>
      </div>
    </div>
  );
}

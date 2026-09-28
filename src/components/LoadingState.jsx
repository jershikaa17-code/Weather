import './LoadingState.css';

function LoadingState() {
  return (
    <div className="loading-state" aria-live="polite" aria-busy="true">
      <div className="skeleton skeleton-hero">
        <div className="skeleton-hero__top">
          <div className="skeleton-hero__info">
            <span className="skeleton-block skeleton-block--pill" style={{ width: '40%', height: 14 }} />
            <span className="skeleton-block" style={{ width: '55%', height: 28, marginTop: 14 }} />
            <span className="skeleton-block" style={{ width: '35%', height: 14, marginTop: 10 }} />
            <span className="skeleton-block skeleton-block--pill" style={{ width: 90, height: 26, marginTop: 18 }} />
            <span className="skeleton-block" style={{ width: '45%', height: 48, marginTop: 18 }} />
          </div>
          <span className="skeleton-block skeleton-block--circle" />
        </div>
        <div className="skeleton-hero__details">
          {Array.from({ length: 6 }).map((_, i) => (
            <span className="skeleton-block" key={i} style={{ height: 52 }} />
          ))}
        </div>
      </div>

      <div className="skeleton-row">
        {Array.from({ length: 6 }).map((_, i) => (
          <span className="skeleton-block skeleton-row__item" key={i} />
        ))}
      </div>

      <div className="skeleton-grid">
        {Array.from({ length: 7 }).map((_, i) => (
          <span className="skeleton-block skeleton-grid__item" key={i} />
        ))}
      </div>
    </div>
  );
}

export default LoadingState;

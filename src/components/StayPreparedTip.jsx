import { Umbrella } from 'lucide-react';
import './StayPreparedTip.css';

function getTip(precipitation) {
  if (precipitation >= 50) return 'Showers likely later today — keep an umbrella handy.';
  if (precipitation >= 20) return 'A few clouds possible, but mostly fine.';
  return 'Clear skies ahead — enjoy the sunshine.';
}

function StayPreparedTip({ precipitation }) {
  return (
    <section className="stay-prepared card">
      <span className="stay-prepared__wave" aria-hidden="true" />
      <span className="stay-prepared__icon">
        <Umbrella size={20} />
      </span>
      <div className="stay-prepared__text">
        <p className="stay-prepared__title">Stay prepared</p>
        <p className="stay-prepared__tip">{getTip(precipitation)}</p>
      </div>
    </section>
  );
}

export default StayPreparedTip;

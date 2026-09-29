import { Sun } from 'lucide-react';
import { getConditionBlurb } from '../utils/weatherIcons';
import { getGreeting } from '../utils/greeting';
import './GreetingCard.css';

function GreetingCard({ condition, userName }) {
  const greeting = getGreeting(new Date().getHours());

  return (
    <section className="greeting-card card">
      <span className="greeting-card__icon">
        <Sun size={22} />
      </span>
      <p className="greeting-card__greeting">
        {greeting}, <strong>{userName}</strong>
      </p>
      <p className="greeting-card__blurb">{getConditionBlurb(condition)}</p>
    </section>
  );
}

export default GreetingCard;

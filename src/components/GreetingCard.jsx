import { Sun } from 'lucide-react';
import { getConditionBlurb } from '../utils/weatherIcons';
import './GreetingCard.css';

const USER_NAME = 'Adithya';

function getGreeting(hour) {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function GreetingCard({ condition }) {
  const greeting = getGreeting(new Date().getHours());

  return (
    <section className="greeting-card card">
      <span className="greeting-card__icon">
        <Sun size={22} />
      </span>
      <p className="greeting-card__greeting">
        {greeting}, <strong>{USER_NAME}</strong>
      </p>
      <p className="greeting-card__blurb">{getConditionBlurb(condition)}</p>
    </section>
  );
}

export default GreetingCard;

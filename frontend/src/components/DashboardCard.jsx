import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ icon: Icon, value, label, gradient, delay = 0 }) => {
  const [count, setCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) { setCount(0); return; }
    
    let start = 0;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      className={`stat-card ${gradient}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="stat-card-icon">
        <Icon size={22} />
      </div>
      <div className="stat-card-value">{count}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-bg-icon">
        <Icon size={80} />
      </div>
    </motion.div>
  );
};

export default DashboardCard;

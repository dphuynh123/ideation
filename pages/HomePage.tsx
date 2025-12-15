import React from 'react';
import { useNavigate } from 'react-router-dom';
import Homepage from '../components/Homepage';
import { translations } from '../translations';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const t = (key: keyof typeof translations.en) => translations['en'][key] || key;

  const handleGetStarted = () => {
    navigate('/mindmap');
  };

  return <Homepage onGetStarted={handleGetStarted} t={t} />;
};

export default HomePage;
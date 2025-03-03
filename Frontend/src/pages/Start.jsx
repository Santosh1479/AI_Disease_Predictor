import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import EnglishContent from '../components/EnglishContent';
import HindiContent from '../components/HindiContent';
import KannadaContent from '../components/KannadaContent';
import { LanguageContext } from '../context/LanguageContext';

const Start = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  const renderContent = () => {
    switch (language) {
      case 'Hindi':
        return <HindiContent />;
      case 'Kannada':
        return <KannadaContent />;
      default:
        return <EnglishContent />;
    }
  };

  const getContinueText = () => {
    switch (language) {
      case 'Hindi':
        return 'जारी रखें';
      case 'Kannada':
        return 'ಮುಂದುವರಿಸಿ';
      default:
        return 'Continue';
    }
  };

  return (
    <div className='h-screen pt-9 bg-cover bg-bottom inver bg-[url(https://imgs.search.brave.com/a6OFj7XaNSEISPEsbdSvYp9LjB9BA7aKX92fAiavAdM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9p/bnRlcmlvci12aWV3/LW9wZXJhdGluZy1y/b29tXzExNzAtMjI1/NS5qcGc_c2VtdD1h/aXNfaHlicmlk)]  w-full flex justify-between flex-col'>
      <div className='bg-white py-3 px-3 pb-7 absolute bottom-0 w-full rounded-t-2xl'>
        {renderContent()}
        
        <label className="block text-xl mb-4 font-medium text-gray-900 text-center">Preferred Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#eeeeee] mb-5 rounded px-4 py-1 border text-lg placeholder:text-sm w-full"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <option value="English">English</option>
          <option value="Hindi">हिन्दी</option>
          <option value="Kannada">ಕನ್ನಡ</option>
        </select>

        <Link to='/login' className='bg-red-600 flex items-center justify-center w-full text-white rounded-lg py-3 text-2xl mt-2'>
          {getContinueText()}
        </Link>
      </div>
    </div>
  );
}

export default Start;
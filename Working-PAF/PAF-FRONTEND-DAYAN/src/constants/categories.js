import { FaCamera, FaStar, FaVideo, FaMapMarkerAlt, FaQuestionCircle } from 'react-icons/fa';
import { GiBinoculars } from 'react-icons/gi';

export const COLORFUL_CATEGORIES = [
  { id: 'AstroCapture', label: 'AstroCapture', icon: <GiBinoculars />, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 'SkyLog', label: 'SkyLog', icon: <FaStar />, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 'SkillTutorial', label: 'SkillTutorial', icon: <FaVideo />, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 'LocationSpotting', label: 'LocSpot', fullLabel: 'Location-based Spotting', icon: <FaMapMarkerAlt />, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { id: 'AskCosmos', label: 'Ask Cosmos', icon: <FaQuestionCircle />, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
]; 
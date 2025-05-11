import React from 'react';
import {
  FaLongArrowAltRight,
  FaLongArrowAltLeft,
  FaRegCircle,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
  FaExclamationTriangle,
  FaArrowsAlt,
  FaFlagCheckered,
} from 'react-icons/fa';
import { MdRoundaboutRight, MdOutlineStraight } from 'react-icons/md';
import { RouteInstruction } from '@/app/store/slices/directionsSlice';

interface RouteInstructionsProps {
  instructions: RouteInstruction[];
  totalDistance: number;
  totalTime: number;
}

const RouteInstructions: React.FC<RouteInstructionsProps> = ({
  instructions,
  totalDistance,
}) => {
  // Helper function to get appropriate icon based on instruction sign
  const getDirectionIcon = (instruction: RouteInstruction) => {
    // Sign values based on GraphHopper API documentation
    // 0 = continue, 1 = slight right, 2 = right, 3 = sharp right,
    // 4 = finish, 5 = via point, 6 = roundabout,
    // -1 = slight left, -2 = left, -3 = sharp left
    // -7 = keep left, 7 = keep right

    switch (instruction.sign) {
      case 0:
        return <MdOutlineStraight className='text-blue-500' />;
      case 1:
        return (
          <FaRegArrowAltCircleRight className='text-blue-500 rotate-[-45deg]' />
        );
      case 2:
        return <FaRegArrowAltCircleRight className='text-blue-500' />;
      case 3:
        return <FaRegArrowAltCircleRight className='text-blue-500 rotate-45' />;
      case -1:
        return <FaRegArrowAltCircleLeft className='text-blue-500 rotate-45' />;
      case -2:
        return <FaRegArrowAltCircleLeft className='text-blue-500' />;
      case -3:
        return (
          <FaRegArrowAltCircleLeft className='text-blue-500 rotate-[-45deg]' />
        );
      case 4:
        return <FaFlagCheckered className='text-green-600' />;
      case 5:
        return <FaRegCircle className='text-blue-500' />;
      case 6:
        return <MdRoundaboutRight className='text-blue-500' />;
      case 7:
        return <FaLongArrowAltRight className='text-blue-500' />;
      case -7:
        return <FaLongArrowAltLeft className='text-blue-500' />;
      default:
        return <FaExclamationTriangle className='text-yellow-500' />;
    }
  };

  // Format distance in meters or kilometers
  const formatDistance = (distance: number) => {
    return distance < 1000
      ? `${Math.round(distance)} m`
      : `${(distance / 1000).toFixed(1)} km`;
  };

  // Format time in minutes or hours and minutes
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${
        remainingMinutes > 0 ? `${remainingMinutes} min` : ''
      }`;
    }
  };

  // Calculate progress percentage for each instruction
  const getProgressPercentage = (distance: number) => {
    return (distance / totalDistance) * 100;
  };

  return (
    <div className='route-instructions mt-2 rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-slideIn'>
      <div className='bg-blue-50 p-3 border-b border-gray-200'>
        <h3 className='font-medium text-blue-800 flex items-center gap-2'>
          <FaArrowsAlt className='text-blue-600' /> Turn-by-Turn Directions
        </h3>
      </div>

      <div className='max-h-[300px] overflow-y-auto bg-white'>
        {instructions.map((instruction, index) => (
          <div
            key={index}
            className={`
              flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 
              ${instruction.sign === 4 ? 'bg-green-50' : ''}
              ${index === 0 ? 'bg-blue-50' : ''}
              animate-fadeIn
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className='flex flex-col items-center mr-3 relative'>
              <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm'>
                {getDirectionIcon(instruction)}
              </div>

              {/* Connection line to next step */}
              {index < instructions.length - 1 && (
                <div className='h-full w-0.5 bg-gray-200 absolute top-8 bottom-0'></div>
              )}
            </div>

            <div className='flex-1'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='font-medium text-gray-800'>
                    {instruction.text}
                  </p>
                  {instruction.street_name && (
                    <p className='text-xs text-gray-500 mt-0.5'>
                      {instruction.street_name}
                    </p>
                  )}
                </div>
                <div className='text-right'>
                  <p className='text-xs font-medium text-gray-700'>
                    {formatDistance(instruction.distance)}
                  </p>
                  {instruction.time > 0 && (
                    <p className='text-xs text-gray-500'>
                      {formatTime(instruction.time)}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {instruction.distance > 0 && (
                <div className='w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden'>
                  <div
                    className='h-full bg-blue-400'
                    style={{
                      width: `${getProgressPercentage(instruction.distance)}%`,
                      transition: 'width 0.5s ease-in-out',
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteInstructions;

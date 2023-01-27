import React from 'react';

export const Logo = () => {
  return (
    // <div className='w-screen mx-auto'>
    <svg
      className="mx-auto h-[24px] w-[24px]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path fill="#14AEDE" d="M0 0h78v156H0z" />
      <path
        fill="#2E2D2C"
        d="M88.4 0a52.002 52.002 0 0 1 52 52 52.004 52.004 0 0 1-32.1 48.042A52.007 52.007 0 0 1 88.4 104V0Z"
      />
      <circle cx="109.2" cy="135.2" r="20.8" fill="#14AEDE" />
    </svg>
  );
};

export const LogoSmall = ({ onClick }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 23 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="cursor-pointer"
    >
      <rect y="0.555557" width="12.4444" height="24.8889" fill="#14AEDE" />
      <path
        d="M14.1037 0.555557C15.1932 0.555557 16.272 0.770147 17.2786 1.18708C18.2851 1.604 19.1997 2.2151 19.9701 2.98549C20.7405 3.75587 21.3516 4.67045 21.7685 5.677C22.1854 6.68355 22.4 7.76237 22.4 8.85185C22.4 9.94134 22.1854 11.0202 21.7685 12.0267C21.3516 13.0333 20.7405 13.9478 19.9701 14.7182C19.1997 15.4886 18.2851 16.0997 17.2786 16.5166C16.272 16.9336 15.1932 17.1481 14.1037 17.1481L14.1037 0.555557Z"
        fill="#2E2D2C"
      />
      <circle cx="17.4222" cy="22.1259" r="3.31852" fill="#14AEDE" />
    </svg>
  );
};

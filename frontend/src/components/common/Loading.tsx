import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  size = 'medium',
  text = 'Loading...'
}) => {
  const sizeMap = {
    small: 24,
    medium: 36,
    large: 48
  };

  const svgSize = sizeMap[size];

  const containerClass = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 36 36"
          xmlSpace="preserve"
          width={svgSize}
          height={svgSize}
          className="text-blue-600 dark:text-blue-400"
        >
          <style>
            {`
              .box5532 {
                fill: currentColor;
                transform-origin: 50% 50%;
              }

              @keyframes box5532-1 {
                9.0909090909% { transform: translate(-12px, 0); }
                18.1818181818% { transform: translate(0px, 0); }
                27.2727272727% { transform: translate(0px, 0); }
                36.3636363636% { transform: translate(12px, 0); }
                45.4545454545% { transform: translate(12px, 12px); }
                54.5454545455% { transform: translate(12px, 12px); }
                63.6363636364% { transform: translate(12px, 12px); }
                72.7272727273% { transform: translate(12px, 0px); }
                81.8181818182% { transform: translate(0px, 0px); }
                90.9090909091% { transform: translate(-12px, 0px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(1) {
                animation: box5532-1 4s infinite;
              }

              @keyframes box5532-2 {
                9.0909090909% { transform: translate(0, 0); }
                18.1818181818% { transform: translate(12px, 0); }
                27.2727272727% { transform: translate(0px, 0); }
                36.3636363636% { transform: translate(12px, 0); }
                45.4545454545% { transform: translate(12px, 12px); }
                54.5454545455% { transform: translate(12px, 12px); }
                63.6363636364% { transform: translate(12px, 12px); }
                72.7272727273% { transform: translate(12px, 12px); }
                81.8181818182% { transform: translate(0px, 12px); }
                90.9090909091% { transform: translate(0px, 12px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(2) {
                animation: box5532-2 4s infinite;
              }

              @keyframes box5532-3 {
                9.0909090909% { transform: translate(-12px, 0); }
                18.1818181818% { transform: translate(-12px, 0); }
                27.2727272727% { transform: translate(0px, 0); }
                36.3636363636% { transform: translate(-12px, 0); }
                45.4545454545% { transform: translate(-12px, 0); }
                54.5454545455% { transform: translate(-12px, 0); }
                63.6363636364% { transform: translate(-12px, 0); }
                72.7272727273% { transform: translate(-12px, 0); }
                81.8181818182% { transform: translate(-12px, -12px); }
                90.9090909091% { transform: translate(0px, -12px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(3) {
                animation: box5532-3 4s infinite;
              }

              @keyframes box5532-4 {
                9.0909090909% { transform: translate(-12px, 0); }
                18.1818181818% { transform: translate(-12px, 0); }
                27.2727272727% { transform: translate(-12px, -12px); }
                36.3636363636% { transform: translate(0px, -12px); }
                45.4545454545% { transform: translate(0px, 0px); }
                54.5454545455% { transform: translate(0px, -12px); }
                63.6363636364% { transform: translate(0px, -12px); }
                72.7272727273% { transform: translate(0px, -12px); }
                81.8181818182% { transform: translate(-12px, -12px); }
                90.9090909091% { transform: translate(-12px, 0px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(4) {
                animation: box5532-4 4s infinite;
              }

              @keyframes box5532-5 {
                9.0909090909% { transform: translate(0, 0); }
                18.1818181818% { transform: translate(0, 0); }
                27.2727272727% { transform: translate(0, 0); }
                36.3636363636% { transform: translate(12px, 0); }
                45.4545454545% { transform: translate(12px, 0); }
                54.5454545455% { transform: translate(12px, 0); }
                63.6363636364% { transform: translate(12px, 0); }
                72.7272727273% { transform: translate(12px, 0); }
                81.8181818182% { transform: translate(12px, -12px); }
                90.9090909091% { transform: translate(0px, -12px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(5) {
                animation: box5532-5 4s infinite;
              }

              @keyframes box5532-6 {
                9.0909090909% { transform: translate(0, 0); }
                18.1818181818% { transform: translate(-12px, 0); }
                27.2727272727% { transform: translate(-12px, 0); }
                36.3636363636% { transform: translate(0px, 0); }
                45.4545454545% { transform: translate(0px, 0); }
                54.5454545455% { transform: translate(0px, 0); }
                63.6363636364% { transform: translate(0px, 0); }
                72.7272727273% { transform: translate(0px, 12px); }
                81.8181818182% { transform: translate(-12px, 12px); }
                90.9090909091% { transform: translate(-12px, 0px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(6) {
                animation: box5532-6 4s infinite;
              }

              @keyframes box5532-7 {
                9.0909090909% { transform: translate(12px, 0); }
                18.1818181818% { transform: translate(12px, 0); }
                27.2727272727% { transform: translate(12px, 0); }
                36.3636363636% { transform: translate(0px, 0); }
                45.4545454545% { transform: translate(0px, -12px); }
                54.5454545455% { transform: translate(12px, -12px); }
                63.6363636364% { transform: translate(0px, -12px); }
                72.7272727273% { transform: translate(0px, -12px); }
                81.8181818182% { transform: translate(0px, 0px); }
                90.9090909091% { transform: translate(12px, 0px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(7) {
                animation: box5532-7 4s infinite;
              }

              @keyframes box5532-8 {
                9.0909090909% { transform: translate(0, 0); }
                18.1818181818% { transform: translate(-12px, 0); }
                27.2727272727% { transform: translate(-12px, -12px); }
                36.3636363636% { transform: translate(0px, -12px); }
                45.4545454545% { transform: translate(0px, -12px); }
                54.5454545455% { transform: translate(0px, -12px); }
                63.6363636364% { transform: translate(0px, -12px); }
                72.7272727273% { transform: translate(0px, -12px); }
                81.8181818182% { transform: translate(12px, -12px); }
                90.9090909091% { transform: translate(12px, 0px); }
                100% { transform: translate(0px, 0px); }
              }

              .box5532:nth-child(8) {
                animation: box5532-8 4s infinite;
              }

              @keyframes box5532-9 {
                9.0909090909% { transform: translate(-12px, 0); }
                18.1818181818% { transform: translate(-12px, 0); }
                27.2727272727% { transform: translate(0px, 0); }
                36.3636363636% { transform: translate(-12px, 0); }
                45.4545454545% { transform: translate(0px, 0); }
                54.5454545455% { transform: translate(0px, 0); }
                63.6363636364% { transform: translate(-12px, 0); }
                72.7272727273% { transform: translate(-12px, 0); }
                81.8181818182% { transform: translate(-24px, 0); }
                90.9090909091% { transform: translate(-12px, 0); }
                100% { transform: translate(0px, 0); }
              }

              .box5532:nth-child(9) {
                animation: box5532-9 4s infinite;
              }
            `}
          </style>
          <g>
            <rect className="box5532" x="13" y="1" rx="1" width="10" height="10" />
            <rect className="box5532" x="13" y="1" rx="1" width="10" height="10" />
            <rect className="box5532" x="25" y="25" rx="1" width="10" height="10" />
            <rect className="box5532" x="13" y="13" rx="1" width="10" height="10" />
            <rect className="box5532" x="13" y="13" rx="1" width="10" height="10" />
            <rect className="box5532" x="25" y="13" rx="1" width="10" height="10" />
            <rect className="box5532" x="1" y="25" rx="1" width="10" height="10" />
            <rect className="box5532" x="13" y="25" rx="1" width="10" height="10" />
            <rect className="box5532" x="25" y="25" rx="1" width="10" height="10" />
          </g>
        </svg>
        {text && (
          <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;


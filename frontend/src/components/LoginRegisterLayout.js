import React from 'react';

import timeManagementSvg from '../assets/time_management.svg';
import mainAppCoverLogo from '../assets/logo/TimeIt-logo/cover.png';

export default function LoginRegisterLayout({ children }) {
  return (
    <div>
      <div className="flex min-h-screen flex-col xl:flex-row">
        <div className="w-full xl:w-8/12 bg-white p-3">
          <div className="flex flex-col justify-center items-center min-h-full">
            <div className="w-4/5 xl:w-2/5">
              <img src={mainAppCoverLogo} className="" alt="" />

              <img src={timeManagementSvg} className="select-none max-w-sm m-auto" alt="" />
              <p className="pt-5 text-lg font-sans">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec tristique mi, ut faucibus sem. Integer
                eros purus, ultrices vitae lacus vitae, fermentum scelerisque nulla. Suspendisse fringilla ultrices nisl
                et cursus
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-gray-200 p-3">{children}</div>
      </div>
    </div>
  );
}

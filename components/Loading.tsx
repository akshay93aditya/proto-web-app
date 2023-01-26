import React from 'react';
import { Logo } from '../dynamic/Logo';

export default function Loading() {
  return (
    <>
      <div className="z-10 flex h-screen flex-col justify-center">
        <div className="my-48">
          <Logo />
        </div>
        <div className="mx-auto my-16 flex w-2/3 items-center">
          <div className="m-2 flex-grow border-t border-solid border-slate-500"></div>
          <span>de_plan</span>
          <div className="m-2 flex-grow border-t border-slate-500"></div>
        </div>
      </div>
    </>
  );
}

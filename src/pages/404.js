import Image from "next/image";
import React from "react";

export default function Notfound() {
  return (
    <div className="flex lg:-ml-80 relative z-20 min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <Image
          src={"/images/404-page-not-found.png"}
          unoptimized
          width={100}
          height={100}
          className="size-1/2 mx-auto"
        />
        {/* <h1 className="text-4xl font-bold text-gray-800">404</h1> */}
        <p className="text-xl text-white mt-4">
          Oops! Looks like you've reached a dead end.
        </p>
        <p className="text-xl text-white my-4">Explore our top categories!</p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <a
            href="/girls?ethnicity=asian"
            className="inline-block bg-[#e0006c] text-white  py-2 px-3 rounded-[10px]"
          >
            Asian
          </a>
          <a
            href="/girls?ethnicity=ebony"
            className="inline-block bg-[#e0006c] text-white  py-2 px-3 rounded-[10px]"
          >
            Ebony
          </a>
          <a
            href="/girls?ethnicity=latina"
            className="inline-block bg-[#e0006c] text-white  py-2 px-3 rounded-[10px]"
          >
            Latina
          </a>
          <a
            href="/trans"
            className="inline-block bg-[#e0006c] text-white  py-2 px-3 rounded-[10px]"
          >
            Trans
          </a>
          <a
            href="/free/trans/asian"
            className="inline-block bg-[#e0006c] text-white  py-2 px-3 rounded-[10px]"
          >
            Free
          </a>
        </div>
        {/* <a
          href="/"
          className="inline-block px-4 py-2 mt-6 text-xs font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Go Home
        </a> */}
      </div>
    </div>
  );
}

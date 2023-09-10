"use client";
import { useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { QrCode as QrImage } from "lucide-react";
import Link from "next/link";

export default function IndexPage() {
  const { isSignedIn } = useAuth();

  const DynamicButton = () => {
    if (isSignedIn) {
      return (
        <Link href="/dashboard">
          <button
            className={`${buttonVariants({ variant: "default" })} mt-10  p-4`}
          >
            Dashboard
          </button>
        </Link>
      );
    } else {
      return (
        <Link href="/sign-in">
          <button
            className={`${buttonVariants({ variant: "default" })} mt-10  p-4`}
          >
            Get started
          </button>
        </Link>
      );
    }
  };

  return (
    <>
      <section className="container mx-auto flex h-[90vh] w-[55rem] flex-col items-center justify-center text-center  [text-wrap:balance] md:py-10">
        <h1 className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-3xl font-extrabold text-transparent md:text-7xl">
          Empower Your Business with QR Pro
        </h1>

        <p className="mt-10 rounded-md border border-dashed p-5 text-xl text-muted-foreground">
          Say goodbye to static QR codes! Generate{" "}
          <span className="font-bold">dynamic</span> QR codes that can be
          updated without having to reprint them. This means that you can always
          keep your QR codes <span className="font-bold">up-to-date</span> with
          the latest information.
        </p>

        <DynamicButton />
      </section>

      <section className="flex h-[90vh] w-full flex-col items-center justify-center text-center md:py-10">
        <h1 className="text-3xl font-bold">What&apos;s in QR Pro?</h1>
        <div className="mt-5 grid grid-cols-1 items-center justify-center gap-16 md:grid-cols-3">
          <div className="flex h-56  w-64 flex-col justify-evenly rounded-md border-2 border-dashed align-middle duration-200 ease-out hover:scale-105">
            <h1 className="mt-5 font-bold">Dynamic QR Code</h1>
            <p>Generate and update QR codes in real-time.</p>
          </div>
          <div className="flex h-56  w-64 flex-col justify-evenly rounded-md border-2 border-dashed align-middle duration-200 ease-out hover:scale-105">
            <h1 className="mt-5 font-bold">Track QR Code Openings</h1>
            <p>Monitor and analyze QR code scans.</p>
          </div>
          <div className="flex h-56  w-64 flex-col justify-evenly rounded-md border-2 border-dashed align-middle duration-200 ease-out hover:scale-105">
            <h1 className="mt-5 font-bold">Edit Your QR Code</h1>
            <p>Modify your QR code without reprinting it.</p>
          </div>
        </div>

        <DynamicButton />
      </section>
    </>
  );
}

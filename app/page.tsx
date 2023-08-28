'use client'
import { useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function IndexPage() {

  const {isSignedIn} = useAuth();

  const DynamicButton = () => {
    if (isSignedIn) {
      return (
        <Link href="/dashboard">
          <button className={`${buttonVariants({ variant: "default" })} mt-10  p-4`}>
            Dashboard
          </button>
        </Link>
      );
    } else {
      return (
        <Link href="/sign-in">
          <button className={`${buttonVariants({ variant: "default" })} mt-10  p-4`}>
            Get started
          </button>
        </Link>
      );
    }
  }

  return (
    <>
      <section className="flex container mx-auto w-[55rem] h-[90vh] items-center justify-center text-center [text-wrap:balance]  md:py-10 flex-col">
        <h1 className="font-extrabold text-transparent text-3xl md:text-6xl bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          Empower Your Business with QR Pro
        </h1>
        <p className="text-xl text-muted-foreground mt-10 border border-dashed p-5 rounded-md">
          Say goodbye to static QR codes! Generate{" "}
          <span className="font-bold">dynamic</span> QR codes that can be
          updated without having to reprint them. This means that you can always
          keep your QR codes <span className="font-bold">up-to-date</span> with
          the latest information.
        </p>
 
        <DynamicButton />
       
        
     
      </section>

      <section className="flex flex-col items-center justify-center h-[90vh] md:py-10 text-center w-full">
        <h1 className="font-bold text-3xl">What&apos;s in QR Pro?</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center justify-center mt-5">
          <div className="h-56 w-64  border-dashed border-2 rounded-md flex flex-col align-middle justify-evenly hover:scale-105 duration-200 ease-out">
            <h1 className="font-bold mt-5">Dynamic QR Code</h1>
            <p>Generate and update QR codes in real-time.</p>
          </div>
          <div className="h-56 w-64  border-dashed border-2 rounded-md flex flex-col align-middle justify-evenly hover:scale-105 duration-200 ease-out">
            <h1 className="font-bold mt-5">Track QR Code Openings</h1>
            <p>Monitor and analyze QR code scans.</p>
          </div>
          <div className="h-56 w-64  border-dashed border-2 rounded-md flex flex-col align-middle justify-evenly hover:scale-105 duration-200 ease-out">
            <h1 className="font-bold mt-5">Edit Your QR Code</h1>
            <p>Modify your QR code without reprinting it.</p>
          </div>
        </div>
 
        <DynamicButton />
       
      </section>
    </>
  );
}

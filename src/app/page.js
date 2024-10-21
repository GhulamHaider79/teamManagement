'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Router, useRouter } from "next/navigation";



export default function Home() {
  const route = useRouter();
  const [loading, setLoading] = useState(false);


  function handleClick() {
    route.push('/signup')
    setLoading(true)
  }
  return (
   <>
    
    <div className=" bg-gray-100  ">
       <div className="flex flex-col justify-center items-center gap-4 h-screen">
      
       {loading ? (<div> Loading... </div>) : (<button onClick={handleClick} type="button" className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Get Starded</button>)}
       
        <p>
          Here You will find real world chat experience!
        </p>
       </div>
   </div>
   </>
  );
}

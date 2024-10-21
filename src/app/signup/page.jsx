"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, 
  createUserWithEmailAndPassword,
  db,
  addDoc,
  collection,
} from '../firebase/firebase-config'

function SignupPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRouter();

    

    function  handleSubmit(e) {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
    
          const user = userCredential.user;

          try {
           
            const docRef = await addDoc(collection(db, "users"), {
              name: userName,
              email: email,
              userId: user.uid
            });

            localStorage.setItem('loginUser', user.uid); 
   
            setLoading(false)

            if(user){
           route.push('/userProfile')
            }

           
          } catch (error) {
            console.error("Error adding document: ", error);
          }

          

  
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    }

  return (
    <div className='flex h-screen items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-[350px] bg-gray-300 p-8 flex flex-col gap-8 items-center rounded-lg '>
        <div>
          <h2 className='text-3xl font-bold'>Signup</h2>
        </div>
        <div className='flex flex-col gap-4 '>

          <div className='flex flex-col '>
            <label htmlFor="name">Name</label>
            <input onChange={((e)=> setUserName(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="text" id='name' />
          </div>

          <div className='flex flex-col '>
            <label htmlFor="email">Email</label>
            <input onChange={((e)=> setEmail(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="email" id='email' />
          </div>

          <div className='flex flex-col  '>
            <label htmlFor="password">Password</label>
            <input onChange={((e)=> setPassword(e.target.value))} className='w-[18rem] p-2 rounded-md hover:bg-gray-100' type="password" id='password' />
          </div>
        </div>

        {loading ? (<div>Loading..</div>) : (<button type='submit' className="w-32 p-3  font-bold rounded-md bg-green-300 hover:bg-green-500 ">Submit</button>)}

        <p>If already have account go <Link href={'/signin'} className='font-bold' >Login</Link> </p>



      </form>
    </div>
  )
}

export default SignupPage
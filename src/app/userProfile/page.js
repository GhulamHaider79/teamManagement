'use client'
import React, { useEffect, useState } from 'react'
import {auth, db, collection, addDoc, onSnapshot, updateDoc, doc } from '../firebase/firebase-config'

function Page() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamQuestions, setTeamQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answers, setAnswers] = useState({});
  const [selectedTeam, setSelectedTeam] = useState();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [oneTeam, setOneTeam] = useState();
 
    
  
  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      setLoggedInUser(user);
    });
    const usersCollectionRef = collection(db, 'users');

   
    

    // Real-time listener for the 'users' collection
    onSnapshot(usersCollectionRef, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    const teamsCollectionRef = collection(db, 'teams');
    // Real-time listener for the 'teams' collection
    onSnapshot(teamsCollectionRef, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSelectedTeam(teamsData); 
  
    });
  }, []);

  function handleShowForm() {
    setShowForm(true);
  }

  async function handleCreateTeam() {
    if (!teamName || teamMembers.length === 0 || teamQuestions.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    // Create a new team in Firestore
    try {
      const teamDoc = await addDoc(collection(db, 'teams'), {
        name: teamName,
        members: teamMembers,
        questions: teamQuestions.map(question => ({ text: question, answer: '' })),
        createdBy: loggedInUser.uid, 
      });
      alert('Team created successfully');
      setShowForm(false);
      setTeamName('');
      setTeamMembers([]);
      setTeamQuestions([]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  }

  function handleAddQuestion() {
    if (currentQuestion.trim()) {
      setTeamQuestions((prevQuestions) => [...prevQuestions, currentQuestion]);
      setCurrentQuestion('');
    }
  }

  function handleSelectMember(member) {
    if (!teamMembers.includes(member)) {
      setTeamMembers((prevMembers) => [...prevMembers, member]);
    }
  }

  function handleAnswerChange(questionIndex, answer) {
    const newAnswers = { ...answers, [questionIndex]: answer };
    setAnswers(newAnswers);
  }

  async function handleSubmitAnswer(questionIndex) {
    if (!selectedTeam) return;
    
    // Update the answer for the selected question in Firestore
    const teamDocRef = doc(db, 'teams', selectedTeam.id);
    const updatedQuestions = selectedTeam.questions.map((q, index) => 
      index === questionIndex ? { ...q, answer: answers[questionIndex] } : q
    );

    try {
      await updateDoc(teamDocRef, { questions: updatedQuestions });
      alert('Answer submitted successfully');
      setAnswers({});
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }
 
  function handleOneTeam(id) {
    
    const oneTameShow  = document.querySelector('#oneTameShow');
          
          selectedTeam.forEach(element => {
            if (element.id === id) {
              setOneTeam({
                id: element.id,
                members: element.members,
                teamName: element.name,
                questions: element.questions   
              })
            }
          });

          

    oneTameShow.innerHTML = `<div className=' flex flex-col gap-4'> <p className=' flex flex-col gap-4'> Your Team Members : ${oneTeam?.members?.map((member) => (
      member
    ))} </P> 

    <div className=' flex flex-col gap-4'> Your Questions : ${oneTeam?.questions?.map((question) => (
      
      `<p> ${question.text} </P>`
      
    ))} </div> 
    
    </div>`
  }

 

 
  return (
    <div className='flex w-full h-screen justify-between px-6 mt-4 text-black'>
      <div>
      <p>My name: {users?.map(elem =>{
        if ( elem.userId=== loggedInUser?.uid) {
          return elem.name
        }
      }) || 'Guest'}</p>

      </div>

      <div className='flex flex-col items-center'>
        {showForm ? (
          <div className='flex justify-center mt-6'>
            <form
              className='flex flex-col bg-gray-400 gap-4 w-[300px] py-6 items-center justify-center rounded-md'
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTeam();
              }}
            >
              <p>Create Your Team</p>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder='Team name'
                className='w-[15rem] p-2 rounded-md hover:bg-gray-100'
                type='text'
              />
              <div className='w-[15rem] p-2 rounded-md bg-gray-200'>
                <p>Select Team Members:</p>
                {users.map((user) => (
                  <div key={user.id}>
                    <input
                      type='checkbox'
                      onChange={() => handleSelectMember(user.name)}
                    />
                    <label className='ml-2'>{user.name}</label>
                  </div>
                ))}
              </div>
              <input
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder='Add a question'
                className='w-[15rem] p-2 rounded-md hover:bg-gray-100'
                type='text'
              />
              <button
                type='button'
                onClick={handleAddQuestion}
                className='w-32 p-2 font-bold rounded-md bg-blue-300 hover:bg-blue-500'
              >
                Add Question
              </button>
              <div className='w-[15rem] p-2 rounded-md bg-gray-200'>
                <p>Questions:</p>
                <ul>
                  {teamQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
              <button
                type='submit'
                className='w-32 p-3 font-bold rounded-md bg-green-300 hover:bg-green-500'
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <button
            type='button'
            className='w-32 p-3 font-bold rounded-md bg-green-300 hover:bg-green-500'
            onClick={handleShowForm}
          >
            Create Your Team
          </button>
        )}
        <div className='flex flex-col gap-4 items-center mt-4 '>
          <h2 className='font-serif font-black'>You are member of :</h2>
        {selectedTeam ? (selectedTeam.map((team) => (
          <p key={team.id} onClick={() => handleOneTeam(team.id)} className='cursor-pointer flex text-start font-bold font-serif '  >Team : {team.name}</p>
          
        ))) : (
          <p>No team selected</p>
        )}
        </div>
      </div>

      {/* // left side div */}

      <div className='w-1/3 '>
        
        <div id='oneTameShow' className='mt-6 '></div>
      </div>

      
    </div>
  );
}

export default Page;

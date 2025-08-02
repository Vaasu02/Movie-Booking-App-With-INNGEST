import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Loading = () => {
  const{nextUrl}=useParams();
  const navigate=useNavigate();

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/'+nextUrl);
      },8000);
    }
  },[]);
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-primary border-2 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading

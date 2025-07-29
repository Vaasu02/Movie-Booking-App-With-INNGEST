import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-primary border-2 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading

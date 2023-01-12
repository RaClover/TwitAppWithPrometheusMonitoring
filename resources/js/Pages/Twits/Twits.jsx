import React from 'react'

function Twits(props) {
  return (
    <div>Testing inatia
      <p className="text-xl text-green-400">{props.answer}</p>
      <p>{props.mydate.date}</p>
      <p>{props.auth.user.name}</p>
    </div>
  )
} 

export default Twits
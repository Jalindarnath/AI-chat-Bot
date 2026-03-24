import React from 'react'

export default function Answers({ans}) {
    
    function checkHeading(str){
      return /^(\*)(\*)(.*)\*$/.test(str)
    }
    
  return (
    <>
      {ans}
    </>
  )
}

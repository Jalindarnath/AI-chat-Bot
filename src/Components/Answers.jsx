import React from 'react'

export default function Answers({ ans }) {
  if (!ans) return null;

  // Split the text by exactly **something** to render bold parts individually
  const parts = ans.split(/(\*\*.*?\*\*)/g);

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // If this part is our markdown bold string
        if (part.startsWith('**') && part.endsWith('**')) {
          // Slice off the two asterisks from start and end
          const boldText = part.slice(2, -2);
          return <strong key={index} className="text-white font-bold text-lg">{boldText}</strong>;
        }

        // Return normal text chunks
        return <span key={index}>{part}</span>;
      })}
    </div>
  )
}

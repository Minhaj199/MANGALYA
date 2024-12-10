
import React from 'react'
import './dash.css'

interface DashCardProps {
  Title: string;
  Data: number;
}


export function DashCard({ Title, Data }: DashCardProps) {
  return (
    <div className="card">
      <h2>{Data}</h2>
      <p className='text-white'>{Title}</p>
    </div>
  );
}


 

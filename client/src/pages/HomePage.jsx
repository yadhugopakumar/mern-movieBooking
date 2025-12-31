import React from 'react'
import {Carrousal} from '../../components/Carrousal'
import MovieGrid from '../../components/MovieGrid'

const HomePage = () => {
  return (
    <div className='p-6'>
     <Carrousal/>
     <p className='text-2xl my-7 lettertracking-normal font-bold'>
     Movies and shows
     </p>
     <MovieGrid/>
    </div>
  )
}

export default HomePage

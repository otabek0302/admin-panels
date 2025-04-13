import React from 'react'
import StatsBottom from '@/components/sections/stats-bottom'
import StatsMiddle from '@/components/sections/stats-midlle'

const StatsPage = () => {
  return (
    <div className='p-4 flex flex-col gap-4'>
      <StatsMiddle />
      <StatsBottom />
    </div>
  )
}

export default StatsPage

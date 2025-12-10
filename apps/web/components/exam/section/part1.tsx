import { TabsContent } from '@radix-ui/react-tabs'
import React from 'react'
import { Question3 } from '../question/question-3'

const Part1 = () => {
  return (
    <TabsContent className='space-y-4 p-5 flex-1 text-card-foreground rounded-xl shadow-sm dark:shadow-[0_2px_8px_0_rgb(255_255_255_/_0.15),0_1px_4px_-1px_rgb(255_255_255_/_0.1)]' value="part1">
        {
            Array.from({ length: 30 }, (_, i) => (
                <Question3 />
            ))
        }
    </TabsContent>
  )
}

export default Part1
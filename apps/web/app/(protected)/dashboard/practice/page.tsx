import Part1 from '@/components/exam/section/part1';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react'
import { FaVolumeHigh } from "react-icons/fa6";

const Exam = () => {
  return (
    <div className='flex flex-col flex-1'>
        <div className="flex-1 grid grid-cols-6 gap-4">
            {/* sidebar */}
            <div className="col-span-1 flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col p-2 justify-center items-center flex-1 text-card-foreground rounded-xl shadow-sm dark:shadow-[0_2px_8px_0_rgb(255_255_255_/_0.15),0_1px_4px_-1px_rgb(255_255_255_/_0.1)]">
                        <span className='text-xs'>Thời gian còn lại:</span> 
                        <p className='font-bold text-sm'>01:57</p>
                    </div>
                    <div className="flex flex-col p-2 justify-center items-center h-full aspect-square text-card-foreground rounded-xl shadow-sm dark:shadow-[0_2px_8px_0_rgb(255_255_255_/_0.15),0_1px_4px_-1px_rgb(255_255_255_/_0.1)]"><FaVolumeHigh /></div>
                </div>
                <div className="w-full">
                    <Button className='w-full'>Nộp bài</Button>
                </div>
                <div className="flex-1 flex flex-col p-4 gap-4 text-card-foreground rounded-xl shadow-sm dark:shadow-[0_2px_8px_0_rgb(255_255_255_/_0.15),0_1px_4px_-1px_rgb(255_255_255_/_0.1)]">
                    {/* part 1 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 1</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 30 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 2 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 2</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 25 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 3 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 3</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 39 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 4 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 4</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 30 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 5 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 5</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 30 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 6 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 6</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 16 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                    {/* part 7 */}
                    <div className="space-y-1">
                        <p className='font-bold text-sm'>Part 7</p>
                        <div className="flex gap-2 flex-wrap">
                            {
                                Array.from({ length: 54 }, (_, i) => (
                                    <Button variant={'outline'} size={'sm'} className='aspect-square size-8' key={i}>{i}</Button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* exam space */}
            <div className="col-span-5 flex flex-col p-4 flex-1">
                <Tabs defaultValue="account flex-1 flex flex-col">
                    <TabsList>
                        <TabsTrigger value="part1">Part 1</TabsTrigger>
                        <TabsTrigger value="part2">Part 2</TabsTrigger>
                        <TabsTrigger value="part3">Part 3</TabsTrigger>
                        <TabsTrigger value="part4">Part 4</TabsTrigger>
                        <TabsTrigger value="part5">Part 5</TabsTrigger>
                        <TabsTrigger value="part6">Part 6</TabsTrigger>
                        <TabsTrigger value="part7">Part 7</TabsTrigger>
                    </TabsList>
                    <Part1 />
                    
                    
                </Tabs>
                
            </div>
        </div>
    </div>
  )
}

export default Exam
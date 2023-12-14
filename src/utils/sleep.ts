/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
sleep.ts (c) 2023
Desc: description
Created:  2023-07-13T03:25:15.237Z
Modified: 2023-12-13T13:52:02.387Z
*/

export async function sleep(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

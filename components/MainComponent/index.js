import React, { useMemo } from 'react'
import { } from 'react-native'
import { observer, useSession, useQueryDoc, useQuery, useDoc } from 'startupjs'
import './index.styl'
import RoomSelection from '../RoomSelection'
import ControlRoom from '../ControlRoom'
import GameRoom from '../GameRoom'

export default observer(function MainComponent ({ style }) {
  const [myId] = useSession('userId')

  const [isGameCreatedByMe, $isGameCreatedByMe] = useQueryDoc('gamesCollection', { creatorId: myId, status: 'open' })

  const [followPlayers] = useQuery('playersCollection', { userId: myId })
  console.log(followPlayers)
  const followPlayersIds = useMemo(() => {
    return followPlayers.map(p => {
      if (p.answers.length <= 5) {
        return (
          p.gameId
        )
      }
    })
  }, JSON.stringify(followPlayers))
  let activeGameId = followPlayersIds[0]

  const [followGameByGameId, $followGameByGameId] = useDoc('gamesCollection', activeGameId)

  function sumPoints (points) {
    let sum = 0
    for (let i = 0; i < points.length; i++) {
      sum = sum + points[i]
    }
    return sum
  }

  function getPoints (choise1, choise2) {
    let roundPoints = []
    if ((choise1 === 'Stone' && choise2 === 'Stone') || (choise2 === 'Stone' && choise1 === 'Stone')) {
      roundPoints.push(0, 0)
    } else if ((choise1 === 'Scissors' && choise2 === 'Scissors') || (choise2 === 'Scissors' && choise1 === 'Scissors')) {
      roundPoints.push(0, 0)
    } else if ((choise1 === 'Paper' && choise2 === 'Paper') || (choise2 === 'Paper' && choise1 === 'Paper')) {
      roundPoints.push(0, 0)
    } else if (choise1 === 'Stone' && choise2 === 'Scissors') {
      roundPoints.push(1, 0)
    } else if (choise1 === 'Scissors' && choise2 === 'Stone') {
      roundPoints.push(0, 1)
    } else if (choise1 === 'Stone' && choise2 === 'Paper') {
      roundPoints.push(0, 1)
    } else if (choise1 === 'Paper' && choise2 === 'Stone') {
      roundPoints.push(1, 0)
    } else if (choise1 === 'Scissors' && choise2 === 'Paper') {
      roundPoints.push(1, 0)
    } else if (choise1 === 'Paper' && choise2 === 'Scissors') {
      roundPoints.push(0, 1)
    }
    return roundPoints
  }

  return pug`
    if isGameCreatedByMe
      ControlRoom(
        followGame=isGameCreatedByMe 
        $followGame=$isGameCreatedByMe 
        sumPoints=sumPoints
        getPoints=getPoints)
    else if followGameByGameId
      GameRoom(
        followGame=followGameByGameId 
        $followGame=$followGameByGameId 
        sumPoints=sumPoints
        getPoints=getPoints)
    else
      RoomSelection
      
  `
})

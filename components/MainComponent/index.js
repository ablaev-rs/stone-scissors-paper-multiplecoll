import React, { useMemo, useState } from 'react'
import { } from 'react-native'
import { observer, useSession, useQueryDoc, useQuery, useDoc } from 'startupjs'
import './index.styl'
import RoomSelection from '../RoomSelection'
import ControlRoom from '../ControlRoom'
import GameRoom from '../GameRoom'

export default observer(function MainComponent ({ style }) {
  const [myId] = useSession('userId')
  const [disabledBtn, setDisabledBtn] = useState('')
  const [isGameCreatedByMe, $isGameCreatedByMe] = useQueryDoc('gamesCollection', { creatorId: myId, status: 'open' })

  const [followPlayers] = useQuery('playersCollection', { userId: myId })
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

  return pug`
    if isGameCreatedByMe
      ControlRoom(
        followGame=isGameCreatedByMe 
        $followGame=$isGameCreatedByMe 
        sumPoints=sumPoints)
    else if followGameByGameId
      GameRoom(
        followGame=followGameByGameId 
        $followGame=$followGameByGameId 
        sumPoints=sumPoints)
    else
      RoomSelection
      
  `
})

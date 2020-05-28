import React from 'react'
import { View, Button, Text } from 'react-native'
import { observer, useQueryDoc } from 'startupjs'
import './index.styl'
import ResultTable from '../ResultTable'

export default observer(function ControlRoom ({ followGame, $followGame, sumPoints, getPoints }) {
  let roundPointsUser1 = []
  let roundPointsUser2 = []
  let disabledBtn = 'disabled'
  let round = followGame.round
  let playerId1 = followGame.usersId[0]
  let playerId2 = followGame.usersId[1]
  let answerPlayer1
  let answerPlayer2
  let point

  const [player1] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId1 })
  const [player2] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId2 })

  if (player1 && player2) {
    answerPlayer1 = player1.answers
    answerPlayer2 = player2.answers
  } else {
    answerPlayer1 = []
    answerPlayer2 = []
  }

  if ((answerPlayer1.length !== answerPlayer2.length) || ((answerPlayer1.length === 0) && (answerPlayer2.length === 0))) {
    disabledBtn = 'disabled'
  } else if ((answerPlayer1.length < followGame.round) && (answerPlayer2.length < followGame.round)) {
    disabledBtn = 'disabled'
  } else if ((answerPlayer1.length === followGame.round) && (answerPlayer2.length === followGame.round)) {
    disabledBtn = ''
  } else {
    disabledBtn = ''
  }

  if (answerPlayer1.length === answerPlayer2.length && answerPlayer1.length !== 0 && answerPlayer2.length !== 0) {
    for (let i = 0; i < answerPlayer1.length; i++) {
      for (let j = 0; j < answerPlayer2.length; j++) {
        if (i === j) {
          point = getPoints(answerPlayer1[i], answerPlayer2[j])
          roundPointsUser1.push(point[0])
          roundPointsUser2.push(point[1])
        }
      }
    }
  }

  function nextRoundHandler () {
    round++
    $followGame.set('round', round)
    disabledBtn = 'disabled'
  }

  function closeGameHandler () {
    $followGame.set('status', 'close')
  }

  return pug`
    View.root
      Text.textStyle Game control. Round #{round}
     
      if ((answerPlayer1.length === 5) && (answerPlayer2.length === 5))
        Button(title = 'Close Game' onPress = closeGameHandler)
      else
        Button(title = 'Next Round' onPress = nextRoundHandler disabled = disabledBtn)

      ResultTable(followGame=followGame sumPoints=sumPoints roundPointsUser1=roundPointsUser1 roundPointsUser2=roundPointsUser2)
            
  `
})

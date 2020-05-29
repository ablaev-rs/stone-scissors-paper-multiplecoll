import React, { useState } from 'react'
import { View, Button, Text } from 'react-native'
import { observer, useQueryDoc, useSession, useDoc, useLocal, useQuery } from 'startupjs'
import { Radio, Alert } from '@startupjs/ui'
import './index.styl'
import { getPoints, sumPoints } from '../functions'
import ResultTable from '../ResultTable'

export default observer(function GameRoom () {
  const [params] = useLocal('$render.params')
  const gameId = params.gameId

  const [myId] = useSession('userId')
  const [game] = useDoc('games', gameId)
  let playerId1 = game.userIds[0]
  let playerId2 = game.userIds[1]
  let gameOver = false
  let message
  let roundPointsUser1 = []
  let roundPointsUser2 = []
  let answerPlayer1
  let answerPlayer2
  const [selectedItem, setSelectedItem] = useState('Stone')

  const [player1, $player1] = useQueryDoc('players', { gameId: game.id, userId: playerId1 })
  const [player2, $player2] = useQueryDoc('players', { gameId: game.id, userId: playerId2 })
  if (player1 && player2) {
    answerPlayer1 = player1.answers
    answerPlayer2 = player2.answers
  } else {
    answerPlayer1 = []
    answerPlayer2 = []
  }

  if (answerPlayer1.length === answerPlayer2.length && answerPlayer1.length !== 0 && answerPlayer2.length !== 0) {
    for (let i = 0; i < answerPlayer1.length; i++) {
      for (let j = 0; j < answerPlayer2.length; j++) {
        if (i === j) {
          let point = getPoints(answerPlayer1[i], answerPlayer2[j])
          roundPointsUser1.push(point[0])
          roundPointsUser2.push(point[1])
        }
      }
    }
  }

  if (game.status === 'close') {
    gameOver = true
  }

  if (myId === playerId1) {
    if (gameOver) {
      if (sumPoints(roundPointsUser1) > sumPoints(roundPointsUser2)) {
        message = 'You win!'
      } else if (sumPoints(roundPointsUser1) < sumPoints(roundPointsUser2)) {
        message = 'You lose!'
      } else {
        message = 'Draw'
      }
    } else if ((answerPlayer1.length > answerPlayer2.length) || ((answerPlayer1.length === game.round) && (answerPlayer2.length === game.round))) {
      message = 'Wait please'
    }
  } else if (myId === playerId2) {
    if (gameOver) {
      if (sumPoints(roundPointsUser1) > sumPoints(roundPointsUser2)) {
        message = 'You lose!'
      } else if (sumPoints(roundPointsUser1) < sumPoints(roundPointsUser2)) {
        message = 'You win!'
      } else {
        message = 'Draw'
      }
    } else if ((answerPlayer1.length < answerPlayer2.length) || ((answerPlayer1.length === game.round) && (answerPlayer2.length === game.round))) {
      message = 'Wait please'
    }
  }

  function saveChoice () {
    if (myId === playerId1) {
      let ans = answerPlayer1
      ans.push(selectedItem)
      $player1.set('answers', ans)
    } else if (myId === playerId2) {
      let ans = answerPlayer2
      ans.push(selectedItem)
      $player2.set('answers', ans)
    } else {
      console.log('mistake')
    }
  }

  return pug`
    View.root
      if gameOver
        Text.textStyle Game Over
      else
        Text.textStyle Round #{game.round}
        Text.textStyle Make your choice

        Radio.versions(
          value = selectedItem
          onChange = (value) => setSelectedItem(value)
          data = [
            { value: 'Stone', label: 'Stone' }, 
            { value: 'Scissors', label: 'Scissors' }, 
            { value: 'Paper', label: 'Paper' }
          ])

      if message
        Alert(label=message)
      else
        Button.btn(title='Choose' onPress = saveChoice)

      ResultTable(
        game=game
        roundPointsUser1=roundPointsUser1 
        roundPointsUser2=roundPointsUser2
        )
  `
})

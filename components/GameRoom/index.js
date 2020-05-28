import React, { useState } from 'react'
import { View, Button, Text } from 'react-native'
import { observer, useQueryDoc, useSession } from 'startupjs'
import { Radio, Alert } from '@startupjs/ui'
import './index.styl'
import ResultTable from '../ResultTable'

export default observer(function GameRoom ({ followGame, $followGame, sumPoints, getPoints }) {
  const [myId] = useSession('userId')
  let gameOver = false
  let message
  let playerId1 = followGame.usersId[0]
  let playerId2 = followGame.usersId[1]
  let roundPointsUser1 = []
  let roundPointsUser2 = []
  let answerPlayer1
  let answerPlayer2
  const [selectedItem, setSelectedItem] = useState('Stone')

  const [players1, $players1] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId1 })
  const [players2, $players2] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId2 })
  if (players1 && players2) {
    answerPlayer1 = players1.answers
    answerPlayer2 = players2.answers
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

  if ((answerPlayer1.length === 5) && (answerPlayer2.length === 5)) {
    gameOver = true
  }

  if (myId === playerId1) {
    if (gameOver) {
      if (sumPoints(answerPlayer1) > sumPoints(answerPlayer2)) {
        message = 'You win!'
      } else if (sumPoints(answerPlayer1) < sumPoints(answerPlayer2)) {
        message = 'You lose!'
      } else {
        message = 'Draw'
      }
    } else if ((answerPlayer1.length > answerPlayer2.length) || ((answerPlayer1.length === followGame.round) && (answerPlayer2.length === followGame.round))) {
      message = 'Wait please'
    }
  } else if (myId === playerId2) {
    if (gameOver) {
      if (sumPoints(answerPlayer1) > sumPoints(answerPlayer2)) {
        message = 'You lose!'
      } else if (sumPoints(answerPlayer1) < sumPoints(answerPlayer2)) {
        message = 'You win!'
      } else {
        message = 'Draw'
      }
    } else if ((answerPlayer1.length < answerPlayer2.length) || ((answerPlayer1.length === followGame.round) && (answerPlayer2.length === followGame.round))) {
      message = 'Wait please'
    }
  }

  function saveChoice () {
    if (myId === playerId1) {
      let ans = answerPlayer1
      ans.push(selectedItem)
      $players1.set('answers', ans)
    } else if (myId === playerId2) {
      let ans = answerPlayer2
      ans.push(selectedItem)
      $players2.set('answers', ans)
    } else {
      console.log('mistake')
    }
  }

  return pug`
    View.root
      if gameOver
        Text.textStyle Game Over
      else
        Text.textStyle Round #{followGame.round}
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

      ResultTable(followGame=followGame sumPoints=sumPoints roundPointsUser1=roundPointsUser1 roundPointsUser2=roundPointsUser2)
  `
})

import React, { useState } from 'react'
import { View, Button, Text } from 'react-native'
import { observer, useQueryDoc, useSession } from 'startupjs'
import { Radio, Alert } from '@startupjs/ui'
import './index.styl'
import ResultTable from '../ResultTable'

export default observer(function GameRoom ({ followGame, $followGame, sumPoints }) {
  const [myId] = useSession('userId')
  let gameOver = false
  let message
  let playerId1 = followGame.usersId[0]
  let playerId2 = followGame.usersId[1]
  let roundPoints = []
  let roundPointsUser1 = []
  let roundPointsUser2 = []
  const [players1, $players1] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId1 })
  const [players2, $players2] = useQueryDoc('playersCollection', { gameId: followGame.id, userId: playerId2 })
  const [selectedItem, setSelectedItem] = useState('Stone')

  let answerPlayer1 = players1.answers
  let answerPlayer2 = players2.answers

  if (answerPlayer1.length === answerPlayer2.length && answerPlayer1.length !== 0 && answerPlayer2.length !== 0) {
    for (let i = 0; i < answerPlayer1.length; i++) {
      for (let j = 0; j < answerPlayer2.length; j++) {
        if (i === j) {
          getPoints(answerPlayer1[i], answerPlayer2[j])
          roundPointsUser1.push(roundPoints[0])
          roundPointsUser2.push(roundPoints[1])
        }
      }
    }
  }

  if ((players1.answers.length === 5) && (players2.answers.length === 5)) {
    gameOver = true
  }

  if (myId === playerId1) {
    if (gameOver) {
      if (sumPoints(players1.answers) > sumPoints(players2.answers)) {
        message = 'You win!'
      } else if (sumPoints(players1.answers) < sumPoints(players2.answers)) {
        message = 'You lose!'
      } else {
        message = 'Draw'
      }
    } else if ((players1.answers.length > players2.answers.length) || ((players1.answers.length === followGame.round) && (players2.answers.length === followGame.round))) {
      message = 'Wait please'
    }
  } else if (myId === playerId2) {
    if (gameOver) {
      if (sumPoints(players1.answers) > sumPoints(players2.answers)) {
        message = 'You lose!'
      } else if (sumPoints(players1.answers) < sumPoints(players2.answers)) {
        message = 'You win!'
      } else {
        message = 'Draw'
      }
    } else if ((players1.answers.length < players2.answers.length) || ((players1.answers.length === followGame.round) && (players2.answers.length === followGame.round))) {
      message = 'Wait please'
    }
  }

  function getPoints (choise1, choise2) {
    roundPoints = []
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

  function saveChoice () {
    if (myId === playerId1) {
      let ans = players1.answers
      ans.push(selectedItem)
      $players1.set('answers', ans)
    } else if (myId === playerId2) {
      let ans = players2.answers
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

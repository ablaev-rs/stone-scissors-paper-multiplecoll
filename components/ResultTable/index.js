import React from 'react'
import { View, Text } from 'react-native'
import { observer, useDoc } from 'startupjs'
import './index.styl'

export default observer(function ControlRoom ({ followGame, sumPoints, roundPointsUser1, roundPointsUser2 }) {
  let playerId1 = followGame.usersId[0]
  let playerId2 = followGame.usersId[1]
  let name1
  let name2
  let roundsNum = 1

  const [userName1] = useDoc('usersCollection', playerId1)
  const [userName2] = useDoc('usersCollection', playerId2)

  if (userName1) {
    name1 = userName1.name
  } else {
    name1 = 'Player 1'
  }

  if (userName2) {
    name2 = userName2.name
  } else {
    name2 = 'Player 2'
  }


  return pug`
    Text.textStyle Result Table

    View.rounds
      View
        Text.header Round
      View
        Text.header #{name1}
      View
        Text.header #{name2} 
    
    View.rounds
      View
        while roundsNum < 6
          View.row
            Text= roundsNum++
          
      View
        each points1 in roundPointsUser1
          View.row
            Text= points1

      View
        each points2 in roundPointsUser2
          View.row
            Text= points2
    
    View.rounds
      View
        Text.results Sum
      View
        Text.results= sumPoints(roundPointsUser1)
      View
        Text.results= sumPoints(roundPointsUser2)
            
  `
})

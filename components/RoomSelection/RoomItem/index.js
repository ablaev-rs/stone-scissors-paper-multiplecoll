import React from 'react'
import { Text, View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

export default observer(function RoomItem ({ id, status, userIds }) {
  return pug`
    View.rounds
      View
        Text #{id}
    View.rounds
      View
        Text Players #{userIds.length}/2
      View
        Text Status: #{status} 
  `
})

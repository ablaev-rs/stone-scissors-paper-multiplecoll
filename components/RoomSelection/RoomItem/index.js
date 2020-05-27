import React from 'react'
import { Text, View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

export default observer(function RoomItem ({ id, status, usersId }) {

  return pug`
    View.rounds
      View
        Text #{id}
    View.rounds
      View
        Text Players #{usersId.length}/2
      View
        Text Status: #{status}
            
  `
})

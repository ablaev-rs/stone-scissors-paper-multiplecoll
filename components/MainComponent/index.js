import React from 'react'
import { } from 'react-native'
import { observer, useSession, useQueryDoc, emit } from 'startupjs'
import './index.styl'
import RoomSelection from '../RoomSelection'

export default observer(function MainComponent ({ style }) {
  const [myId] = useSession('userId')

  const [isGameCreatedByMe] = useQueryDoc('games', { creatorId: myId, status: 'open' })
  if (isGameCreatedByMe) {
    emit('url', '/control/' + isGameCreatedByMe.id)
  }

  return pug`
    RoomSelection    
  `
})

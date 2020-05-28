import React from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import { GameRoom } from 'components'
import './index.styl'
import { Content } from '@startupjs/ui'

export default observer(function PGames () {
  return pug`
    ScrollView.root
      Content
        GameRoom
  `
})

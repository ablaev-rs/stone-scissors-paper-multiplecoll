import React from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import { ControlRoom } from 'components'
import './index.styl'
import { Content } from '@startupjs/ui'

export default observer(function PControl () {
  return pug`
    ScrollView.root
      Content
        ControlRoom
  `
})

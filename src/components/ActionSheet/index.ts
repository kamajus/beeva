import { SheetDefinition, registerSheet } from 'react-native-actions-sheet'

import CreateWisheActionSheet from './CreateWisheActionSheet'
import DeleteActionSheet from './DeleteActionSheet'
import FilterActionSheet from './FilterActionSheet'
import NotificationMenuSheet from './NotificationMenuSheet'
import ResidenceMenuSheet from './ResidenceMenuSheet'

import { INotification, IResidence } from '@/@types'

registerSheet('filter-search-sheet', FilterActionSheet)
registerSheet('create-wishe-sheet', CreateWisheActionSheet)
registerSheet('account-delete-sheet', DeleteActionSheet)
registerSheet('notification-menu-sheet', NotificationMenuSheet)
registerSheet('residence-menu-sheet', ResidenceMenuSheet)

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'residence-menu-sheet': SheetDefinition<{
      payload: {
        residence: IResidence
      }
    }>

    'notification-menu-sheet': SheetDefinition<{
      payload: {
        notification: INotification
      }
    }>
  }
}

export {}

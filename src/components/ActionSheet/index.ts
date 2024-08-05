import { SheetDefinition, registerSheet } from 'react-native-actions-sheet'

import CreateWisheActionSheet from './CreateWisheActionSheet'
import DeleteActionSheet from './DeleteActionSheet'
import FilterActionSheet from './FilterActionSheet'
import ResidenceMenuSheet from './ResidenceMenuSheet'

import { IResidence } from '@/@types'

registerSheet('filter-search-sheet', FilterActionSheet)
registerSheet('create-wishe-sheet', CreateWisheActionSheet)
registerSheet('account-delete-sheet', DeleteActionSheet)
registerSheet('residence-menu-sheet', ResidenceMenuSheet)

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'residence-menu-sheet': SheetDefinition<{
      payload: {
        residence: IResidence
      }
    }>
  }
}

export {}

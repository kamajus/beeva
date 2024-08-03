import { registerSheet } from 'react-native-actions-sheet'

import CreateWisheActionSheet from './CreateWisheActionSheet'
import DeleteActionSheet from './DeleteActionSheet'
import FilterActionSheet from './FilterActionSheet'

registerSheet('filter-search-sheet', FilterActionSheet)
registerSheet('create-wishe-sheet', CreateWisheActionSheet)
registerSheet('account-delete-sheet', DeleteActionSheet)

export {}

import { registerSheet } from 'react-native-actions-sheet'

import AddWisheActionSheet from './AddWisheActionSheet'
import DeleteActionSheet from './DeleteActionSheet'
import SearchActionSheet from './SearchActionSheet'

registerSheet('search-sheet', SearchActionSheet)
registerSheet('create-wishe-sheet', AddWisheActionSheet)
registerSheet('account-delete-sheet', DeleteActionSheet)

export {}

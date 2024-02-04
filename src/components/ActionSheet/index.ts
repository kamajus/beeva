import { registerSheet } from 'react-native-actions-sheet';

import DeleteActionSheet from './DeleteActionSheet';
import SearchActionSheet from './SearchActionSheet';

registerSheet('search-sheet', SearchActionSheet);
registerSheet('account-delete-sheet', DeleteActionSheet);

export {};

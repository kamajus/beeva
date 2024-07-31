import { BaseRepository } from './base.repository'

import { IResidenceNotification } from '@/assets/@types'

export class ResidenceNotificationRepository extends BaseRepository<IResidenceNotification> {
  constructor() {
    super('residence_notifications')
  }
}
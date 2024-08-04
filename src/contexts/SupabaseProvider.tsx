import { Session, User } from '@supabase/supabase-js'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react'

import { IResidence, INotification, IUser } from '@/@types'
import { supabase } from '@/config/supabase'
import constants from '@/constants'
import { useAlert } from '@/hooks/useAlert'
import { useReset } from '@/hooks/useReset'
import { LovedResidenceRepository } from '@/repositories/loved.residence.repository'
import { NotificationRepository } from '@/repositories/notification.repository'
import { ResidenceRepository } from '@/repositories/residence.repository'
import { SavedResidenceRepository } from '@/repositories/saved.residence.repository'
import { UserRepository } from '@/repositories/user.repository'
import { useLovedResidenceStore } from '@/store/LovedResidenceStore'
import { useNotificationStore } from '@/store/NotificationStore'
import { useOpenedResidenceStore } from '@/store/OpenedResidenceStore'
import { useSavedResidenceStore } from '@/store/SavedResidenceStore'
import { useUserResidenceStore } from '@/store/UserResidenceStore'

type SupabaseContextProps = {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>> | null
  session: Session | null
  initialized?: boolean
  signUp: (
    email: string,
    phone: string,
    password: string,
  ) => Promise<User | null | void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  sendOtpCode: (email: string) => Promise<void>
  uploadResidencesImage: (
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) => Promise<void>
  signOut: () => Promise<void>
  saveResidence: (residence: IResidence, saved: boolean) => Promise<void>
  loveResidence: (residenceId: string, saved: boolean) => Promise<void>
  handleCallNotification: (notification: {
    title: string
    body: string
  }) => void
}

type SupabaseProviderProps = {
  children: React.ReactNode
}

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  setUser: () => {},
  session: null,
  initialized: false,
  signUp: async () => {},
  uploadResidencesImage: async () => {},
  signInWithPassword: async () => {},
  sendOtpCode: async () => {},
  signOut: async () => {},
  saveResidence: async () => {},
  loveResidence: async () => {},
  handleCallNotification: () => {},
})

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const alert = useAlert()

  const [user, setUser] = useState<IUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  const openedResidences = useOpenedResidenceStore((state) => state.residences)
  const addOpenedResidence = useOpenedResidenceStore((state) => state.add)

  const userResidences = useUserResidenceStore((state) => state.residences)
  const addUserResidence = useUserResidenceStore((state) => state.add)

  const savedResidences = useSavedResidenceStore((state) => state.residences)
  const addSavedResidence = useSavedResidenceStore((state) => state.add)
  const removeSavedResidence = useSavedResidenceStore((state) => state.remove)

  const addLovedResidence = useLovedResidenceStore((state) => state.add)
  const removeLovedResidence = useLovedResidenceStore((state) => state.remove)

  const addNotification = useNotificationStore((state) => state.add)

  const userRepository = useMemo(() => new UserRepository(), [])
  const residenceRepository = useMemo(() => new ResidenceRepository(), [])
  const lovedResidenceRepository = useMemo(
    () => new LovedResidenceRepository(),
    [],
  )
  const savedResidenceRepository = useMemo(
    () => new SavedResidenceRepository(),
    [],
  )
  const notificationRepository = useMemo(() => new NotificationRepository(), [])

  const { clearCache } = useReset()

  const signUp = async (email: string, phone: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      phone,
      password,
    })
    if (data.user) return data.user
    throw error
  }

  const uploadResidencesImage = async (
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) => {
    const imagesToAppend: string[] = []

    for (const image of images) {
      if (!image.uri.startsWith(`https://`)) {
        try {
          const base64 = await FileSystem.readAsStringAsync(image.uri, {
            encoding: 'base64',
          })
          const filePath = `${user.id}/${id}/${Date.now()}`
          const { data, error: uploadError } = await supabase.storage
            .from('residences')
            .upload(filePath, decode(base64), { contentType: 'image/png' })

          const photoPath = `${constants.storageUrl}/${data.fullPath}`

          imagesToAppend.push(photoPath)

          if (image.uri === cover && !uploadError && session) {
            const coverURL = photoPath
            await residenceRepository.update(id, { cover: coverURL })
          }

          if (uploadError) {
            alert.showAlert({
              title: 'Erro a realizar postagem',
              message:
                'Houve um problema ao tentar carregar as imagens que você forneceu.',
            })
          }
        } catch {
          alert.showAlert({
            title: 'Erro a realizar postagem',
            message:
              'Houve um problema ao tentar carregar as imagens que você forneceu.',
          })
        }
      } else {
        imagesToAppend.push(image.uri)
      }
    }

    if (session) {
      await residenceRepository.update(id, { photos: imagesToAppend })
    }
  }

  const saveResidence = async (residence: IResidence, saved: boolean) => {
    if (saved) {
      await savedResidenceRepository.create({ residence_id: residence.id })
      addSavedResidence(residence)
    } else {
      await savedResidenceRepository.delete({
        residence_id: residence.id,
        user_id: session.user.id,
      })
      removeSavedResidence(residence.id)
    }
  }

  const loveResidence = async (residenceId: string, liked: boolean) => {
    if (liked) {
      const data = await lovedResidenceRepository.create({
        residence_id: residenceId,
      })
      addLovedResidence(data)
    } else {
      await lovedResidenceRepository.delete({
        residence_id: residenceId,
        user_id: session.user.id,
      })
      removeLovedResidence(residenceId)
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      let redirect: string
      if (error.status && error.message === 'Email not confirmed') {
        supabase.auth.resend({ email, type: 'signup' })
        redirect = `/verification/${email}`
      }

      // eslint-disable-next-line no-throw-literal
      throw {
        message: 'As credências de acesso a conta estão incorrectas.',
        redirect,
      }
    }
  }

  const sendOtpCode = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://example.com/welcome',
      },
    })
    if (error) throw error
  }

  const signOut = useCallback(async () => {
    await supabase.auth
      .signOut()
      .then(() => {
        router.replace('/signin')
        clearCache()
      })
      .catch((error) => {
        console.error(error)
      })
  }, [clearCache])

  const handleCallNotification = (notification: {
    title: string
    body: string
  }) => {
    Notifications.scheduleNotificationAsync({
      content: { title: notification.title, body: notification.body },
      trigger: null,
    })
  }

  const setupUserChannel = useCallback((userId: string) => {
    supabase
      .channel('users')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public' },
        async (payload: { new: IUser }) => {
          if (payload.new.id === userId) {
            setUser(payload.new)
          }
        },
      )
      .subscribe()
  }, [])

  const setupNotificationsChannel = useCallback(
    (userId: string) => {
      supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public' },
          async (payload: { new: INotification }) => {
            if (payload.new.user_id === userId && payload.new?.title) {
              addNotification(payload.new)
              handleCallNotification({
                title: payload.new.title,
                body: payload.new.description,
              })
            }
          },
        )
        .subscribe()
    },
    [addNotification],
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        try {
          await userRepository.findById(session.user.id).then((data) => {
            setUser(data)
          })

          await notificationRepository
            .findByUserId(session.user.id)
            .then((data) => {
              for (const item of data) {
                addNotification(item)
              }
            })

          setSession(session)
          setupUserChannel(session.user.id)
          setupNotificationsChannel(session.user.id)
        } catch {
          await signOut()
        }
      }

      setInitialized(true)
    })

    return () => subscription.unsubscribe()
  }, [
    addNotification,
    notificationRepository,
    setupNotificationsChannel,
    setupUserChannel,
    signOut,
    userRepository,
  ])

  useEffect(() => {
    supabase
      .channel('residences')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public' },
        async (payload: { new: IResidence }) => {
          if (payload.new) {
            if (userResidences.some((r) => r.id === payload.new.id)) {
              addUserResidence(payload.new)
            }
            if (savedResidences.some((r) => r.id === payload.new.id)) {
              addSavedResidence(payload.new)
            }
            if (
              Object.values(openedResidences).some(
                ({ residence: r }) => r.id === payload.new.id,
              )
            ) {
              addOpenedResidence(payload.new)
            }
          }
        },
      )
      .subscribe()
  }, [
    userResidences,
    savedResidences,
    openedResidences,
    addUserResidence,
    addSavedResidence,
    addOpenedResidence,
  ])

  return (
    <SupabaseContext.Provider
      value={{
        user,
        setUser,
        session,
        initialized,
        signUp,
        signInWithPassword,
        sendOtpCode,
        signOut,
        saveResidence,
        loveResidence,
        handleCallNotification,
        uploadResidencesImage,
      }}>
      {children}
    </SupabaseContext.Provider>
  )
}

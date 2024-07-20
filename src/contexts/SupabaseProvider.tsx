import { Session, User } from '@supabase/supabase-js'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { createContext, useEffect, useState, useCallback } from 'react'

import { IResidence, INotification, IUser } from '@/assets/@types'
import { supabase } from '@/config/supabase'
import { formatPhotoUrl } from '@/functions/format'
import { useAlert } from '@/hooks/useAlert'
import { useCache } from '@/hooks/useCache'
import { useResidenceStore } from '@/store/ResidenceStore'

type SupabaseContextProps = {
  user: IUser | null
  setUser: React.Dispatch<React.SetStateAction<IUser | null>> | null
  session: Session | null
  initialized?: boolean
  signUp: (email: string, password: string) => Promise<User | null | void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  sendOtpCode: (email: string) => Promise<void>
  uploadResidencesImage: (
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) => Promise<void>
  signOut: () => Promise<void>
  getResidenceById: (id: string) => Promise<IResidence | void>
  getUserById: (id?: string, upsert?: boolean) => Promise<IUser | void>
  saveResidence: (residence: IResidence, saved: boolean) => Promise<void>
  handleCallNotification: (title: string, body: string) => void
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
  getUserById: async () => {},
  getResidenceById: async () => {},
  saveResidence: async () => {},
  handleCallNotification: () => {},
})

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const alert = useAlert()
  const [user, setUser] = useState<IUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)
  const { setNotifications } = useCache()

  const userResidences = useResidenceStore((state) => state.userResidences)
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const savedResidences = useResidenceStore((state) => state.savedResidences)
  const addToResidences = useResidenceStore((state) => state.addToResidences)
  const pushResidence = useResidenceStore((state) => state.pushResidence)
  const removeResidence = useResidenceStore((state) => state.removeResidence)

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
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
      if (
        !image.uri.includes(
          `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
        )
      ) {
        try {
          const base64 = await FileSystem.readAsStringAsync(image.uri, {
            encoding: 'base64',
          })
          const filePath = `${user?.id}/${id}/${Date.now()}`
          const { data: photo, error: uploadError } = await supabase.storage
            .from('residences')
            .upload(filePath, decode(base64), { contentType: 'image/png' })

          imagesToAppend.push(
            `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`,
          )

          if (image.uri === cover && !uploadError && session) {
            const coverURL = `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`
            await supabase
              .from('residences')
              .update({ cover: coverURL })
              .eq('id', id)
              .eq('owner_id', session.user.id)
          }

          if (uploadError) {
            alert.showAlert(
              'Erro a realizar postagem',
              'Houve um problema ao tentar carregar as imagens que você forneceu.',
              'Ok',
              () => {},
            )
          }
        } catch {
          alert.showAlert(
            'Erro a realizar postagem',
            'Houve um problema ao tentar carregar as imagens que você forneceu.',
            'Ok',
            () => {},
          )
        }
      } else {
        imagesToAppend.push(image.uri)
      }
    }

    if (session) {
      await supabase
        .from('residences')
        .update({ photos: imagesToAppend })
        .eq('id', id)
        .eq('owner_id', session.user.id)
    }
  }

  const saveResidence = async (residence: IResidence, saved: boolean) => {
    if (saved) {
      await supabase
        .from('saved_residences')
        .insert({ residence_id: residence.id })
      addToResidences(residence, 'saved')
    } else {
      await supabase
        .from('saved_residences')
        .delete()
        .eq('residence_id', residence.id)
      removeResidence(residence.id)
    }
  }

  const getResidenceById = useCallback(
    async (id: string) => {
      if (cachedResidences[id]) return cachedResidences[id]

      const { data, error } = await supabase
        .from('residences')
        .select('*')
        .eq('id', id)
        .single<IResidence>()

      if (error) throw error
      cachedResidences[id] = data

      return data
    },
    [cachedResidences],
  )

  const getUserById = useCallback(
    async (id?: string, upsert?: boolean) => {
      if (!upsert && user && user.id === id) return user

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id || user?.id)
        .single<IUser>()
      if (error) throw error

      if (data.photo_url) {
        data.photo_url = formatPhotoUrl(data.photo_url, data.updated_at)
      }

      return data
    },
    [user],
  )

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      let redirect: string

      if (error.status) {
        if (error.message === 'Email not confirmed') {
          supabase.auth.resend({ email, type: 'signup' })
          redirect = `/verification/${email}`
        }
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateNotifications = useCallback(
    (notification: INotification) => {
      setNotifications((prevNotifications) => {
        const index = prevNotifications.findIndex(
          (r) => r.id === notification.id,
        )
        if (index !== -1) {
          return [
            notification,
            ...prevNotifications.slice(0, index),
            ...prevNotifications.slice(index + 1),
          ]
        } else {
          return [notification, ...prevNotifications]
        }
      })
    },
    [setNotifications],
  )

  const handleCallNotification = (title: string, body: string) => {
    Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    })
  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      console.log('loading user data...')
      if (session) {
        try {
          const userData = await getUserById(session.user.id, true)
          setUser(userData)

          if (!userData) {
            await supabase.auth.signOut()
            router.replace('/signin')
          }

          const { data: notificationsData } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('user_id', session.user.id)

          if (notificationsData) {
            setNotifications(notificationsData)
          }

          supabase
            .channel('users')
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public' },
              async (payload: { new: IUser }) => {
                if (payload.new.id === session.user.id) {
                  setUser({
                    ...payload.new,
                    photo_url: formatPhotoUrl(
                      payload.new.photo_url,
                      payload.new.updated_at,
                    ),
                  })
                }
              },
            )
            .subscribe()

          supabase
            .channel('notifications')
            .on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public' },
              async (payload: { new: INotification }) => {
                if (payload.new.user_id === session.user.id) {
                  updateNotifications(payload.new)
                  handleCallNotification(
                    payload.new.title,
                    payload.new.description,
                  )
                }
              },
            )
            .subscribe()
        } catch {
          await supabase.auth.signOut()
          router.replace('/signin')
        }
      } else {
        setUser(null)
      }

      setSession(session)
      setInitialized(true)
    })

    return () => {
      data.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    supabase
      .channel('residences')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public' },
        async (payload: { new: IResidence }) => {
          if (payload.new) {
            if (userResidences.some((r) => r.id === payload.new.id)) {
              addToResidences(payload.new, 'user')
            }

            if (savedResidences.some((r) => r.id === payload.new.id)) {
              addToResidences(payload.new, 'saved')
            }

            if (
              Object.values(cachedResidences).some(
                ({ residence: r }) => r.id === payload.new.id,
              )
            ) {
              pushResidence(payload.new)
            }
          }
        },
      )
      .subscribe()
  }, [
    userResidences,
    savedResidences,
    cachedResidences,
    addToResidences,
    pushResidence,
  ])

  return (
    <SupabaseContext.Provider
      value={{
        getUserById,
        getResidenceById,
        user,
        setUser,
        session,
        initialized,
        signUp,
        signInWithPassword,
        sendOtpCode,
        signOut,
        saveResidence,
        handleCallNotification,
        uploadResidencesImage,
      }}>
      {children}
    </SupabaseContext.Provider>
  )
}

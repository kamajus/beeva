import { Session, User } from '@supabase/supabase-js'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { createContext, useEffect, useState, useCallback } from 'react'

import { IResidence, INotification, IUser } from '../assets/@types'
import { supabase } from '../config/supabase'
import { formatPhotoUrl } from '../functions/format'
import { useAlert } from '../hooks/useAlert'
import { useCache } from '../hooks/useCache'
import { useResidenceStore } from '../store/ResidenceStore'

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
  getUserById: (id?: string, upsert?: boolean) => Promise<IUser | void>
  handleFavorite: (id: string, saved: boolean) => Promise<void>
  handleCallNotification(title: string, body: string): void
  residenceIsFavorite: (id: string) => Promise<boolean>
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
  handleFavorite: async () => {},
  residenceIsFavorite: async () => false,
  handleCallNotification: async () => {},
})

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const alert = useAlert()
  const [user, setUser] = useState<IUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)
  const { setNotifications, notifications } = useCache()

  const userResidences = useResidenceStore((state) => state.userResidences)
  const cachedResidences = useResidenceStore((state) => state.cachedResidences)
  const favoritesResidences = useResidenceStore(
    (state) => state.favoritesResidences,
  )
  const addToResidences = useResidenceStore((state) => state.addToResidences)
  const pushResidence = useResidenceStore((state) => state.pushResidence)

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data.user) {
      return data.user
    } else {
      throw error
    }
  }

  const uploadResidencesImage = async (
    id: string,
    cover: string,
    images: ImagePicker.ImagePickerAsset[],
  ) => {
    const imagesToAppend = []

    for (const image of images) {
      // Checking if the image has already been posted or is stored locally
      if (
        !image.uri.includes(
          `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
        )
      ) {
        try {
          // Read image as base64
          const base64 = await FileSystem.readAsStringAsync(image.uri, {
            encoding: 'base64',
          })

          // Define the file path based on user ID, residence ID, and timestamp
          const filePath = `${user?.id}/${id}/${new Date().getTime()}`

          // Upload the image to Supabase storage
          const { data: photo, error: uploadError } = await supabase.storage
            .from('residences')
            .upload(filePath, decode(base64), { contentType: 'image/png' })

          imagesToAppend.push(
            `https://${process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/residences/${photo?.path}`,
          )

          // Check if the uploaded image is the cover image
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

  const residenceIsFavorite = async (id: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user?.id)
      .eq('residence_id', id)
    let isFavorite = false

    data?.forEach((item) => {
      if (item.residence_id === id) {
        isFavorite = true
      }
    })

    return isFavorite
  }

  const handleFavorite = async (id: string, saved: boolean) => {
    if (user) {
      if (!saved) {
        await supabase.from('favorites').insert({
          user_id: user.id,
          residence_id: id,
        })
      } else {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user?.id)
          .eq('residence_id', id)
      }
    }
  }

  const getUserById = useCallback(
    async (id?: string, upsert?: boolean) => {
      if (!upsert && user && user?.id === id) {
        return user
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id || user?.id)
        .single<IUser>()

      if (error) {
        throw error
      }

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
      let message
      let redirect

      if (error.status) {
        if (error.message === 'Email not confirmed') {
          supabase.auth.resend({ email, type: 'signup' })
          redirect = `/verification/${email}`
        }
        message = 'As credências de acesso a conta estão incorrectas.'
      }

      // eslint-disable-next-line no-throw-literal
      throw {
        message,
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

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const updateNotifications = useCallback(
    (notification: INotification) => {
      const index = notifications.findIndex((r) => r.id === notification.id)

      setNotifications((prevNotifications) => {
        if (index !== -1) {
          const updatedNotifications = [
            notification,
            ...prevNotifications.slice(0, index),
            ...prevNotifications.slice(index + 1),
          ]
          return updatedNotifications
        } else {
          return [notification, ...prevNotifications]
        }
      })
    },
    [notifications, setNotifications],
  )

  const handleCallNotification = (title: string, body: string) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    })
  }

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session)

      if (session) {
        await getUserById(session?.user.id, true)
          .then(async (data) => {
            if (data) {
              setUser(data)
            } else {
              await supabase.auth.signOut()
              router.replace('/signin')
            }
            setUser(data)
          })
          .catch(async () => {
            await supabase.auth.signOut()
            router.replace('/signin')
          })

        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .eq('user_id', session?.user.id)

        if (notificationsData) setNotifications(notificationsData)

        supabase
          .channel('users')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
            },
            async (payload: { new: IUser }) => {
              if (payload.new.id === session.user.id) {
                setUser({
                  ...payload.new,
                  photo_url:
                    payload.new.photo_url &&
                    payload.new.photo_url +
                      '?timestamp=' +
                      new Date().getTime(),
                })
              }
            },
          )
          .subscribe()

        supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
            },
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
      } else {
        setUser(null)
      }

      setInitialized(true)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [getUserById, setNotifications, updateNotifications])

  useEffect(() => {
    supabase
      .channel('residences')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
        },
        async (payload: { new: IResidence }) => {
          if (payload.new) {
            if (userResidences.find((r) => r.id === payload.new.id)) {
              addToResidences(payload.new, 'user')
            }

            if (favoritesResidences.find((r) => r.id === payload.new.id)) {
              addToResidences(payload.new, 'favorites')
            }

            if (
              cachedResidences.find(
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
    favoritesResidences,
    cachedResidences,
    addToResidences,
    pushResidence,
  ])

  return (
    <SupabaseContext.Provider
      value={{
        getUserById,
        user,
        setUser,
        session,
        initialized,
        signUp,
        signInWithPassword,
        sendOtpCode,
        signOut,
        handleFavorite,
        handleCallNotification,
        residenceIsFavorite,
        uploadResidencesImage,
      }}>
      {children}
    </SupabaseContext.Provider>
  )
}

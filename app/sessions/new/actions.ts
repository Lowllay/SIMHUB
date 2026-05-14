'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function addSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const session = {
    circuit:      formData.get('circuit')      as string,
    country:      formData.get('country')      as string,
    car:          formData.get('car')          as string,
    category:     formData.get('category')     as string,
    type:         formData.get('type')         as string,
    sim:          formData.get('sim')          as string,
    weather:      formData.get('weather')      as string,
    laptime:      formData.get('laptime')      as string,
    laps:         Number(formData.get('laps')),
    pos:          Number(formData.get('pos') || 0),
    delta:        formData.get('delta')        as string || '',
    setup:        formData.get('setup')        as string || '',
    session_date: formData.get('session_date') as string,
    user_id:      user?.id ?? null,
  }

  const { error } = await supabase.from('sessions').insert(session)
  if (error) throw new Error(error.message)
  redirect('/sessions')
}

import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/dashboard/ProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profil & Verifikasi' }

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()
  const profile = profileRaw as import('@/types/supabase').Profile | null

  const { data: agentRaw } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', user!.id)
    .single()
  const agent = agentRaw as import('@/types/supabase').Agent | null

  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">Profil & Verifikasi</h1>
        <p className="text-sm text-text-secondary font-sans mt-1">
          Lengkapi profil dan upload dokumen untuk mendapatkan badge Agen Terverifikasi
        </p>
      </div>

      {/* Verification status */}
      <div className={`p-4 rounded-sm border mb-8 ${
        agent?.is_verified
          ? 'bg-status-success-bg border-status-success/30 text-status-success'
          : 'bg-status-warning-bg border-status-warning/30 text-status-warning'
      }`}>
        <div className="flex items-center gap-2 text-sm font-sans font-medium">
          {agent?.is_verified ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              Akun Anda telah terverifikasi sebagai Agen PropVista
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
              </svg>
              {agent?.ktp_url ? 'Dokumen sedang dalam review admin' : 'Upload KTP dan lisensi untuk verifikasi agen'}
            </>
          )}
        </div>
      </div>

      <ProfileForm profile={profile} agent={agent} userId={user!.id} />
    </div>
  )
}

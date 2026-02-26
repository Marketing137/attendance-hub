import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const users = [
    { email: 'testadmin@ccd.com', password: 'Admin123!', role: 'admin_rrhh', nombres: 'Admin', apellidos: 'RRHH' },
    { email: 'testjefe@ccd.com', password: 'Jefe123!', role: 'jefe_area', nombres: 'Jefe', apellidos: 'Area' },
    { email: 'testempleado@ccd.com', password: 'Emple123!', role: 'empleado', nombres: 'Empleado', apellidos: 'Test' },
  ]

  const results = []

  for (const u of users) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { nombres: u.nombres, apellidos: u.apellidos }
    })

    if (authError) {
      results.push({ email: u.email, error: authError.message })
      continue
    }

    if (u.role !== 'empleado') {
      await supabaseAdmin.from('user_roles')
        .update({ role: u.role })
        .eq('user_id', authData.user.id)
    }

    results.push({ email: u.email, role: u.role, status: 'created' })
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
})

import { useState } from 'react'
import { supabase } from '../supabaseClient'

const P = "#7C3AED"
const grad = `linear-gradient(135deg,#5B21B6,#7C3AED)`

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', background:'#F5F3FF', fontFamily:'Tajawal,Arial,sans-serif', direction:'rtl'
    }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:40, width:360,
        boxShadow:'0 8px 40px rgba(124,58,237,0.15)'
      }}>
        {/* Logo */}
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{fontSize:48, marginBottom:8}}>☕</div>
          <div style={{fontWeight:900, fontSize:22, color:P}}>FA COFFEE</div>
          <div style={{fontSize:12, color:'#9CA3AF', marginTop:4}}>نقطة البيع</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block', fontWeight:700, fontSize:13, color:'#374151', marginBottom:6}}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="cashier@facoffee.com"
              style={{
                width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB',
                borderRadius:12, fontSize:14, direction:'ltr', textAlign:'left',
                outline:'none', transition:'border .15s'
              }}
              onFocus={e => e.target.style.borderColor = P}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{marginBottom:24}}>
            <label style={{display:'block', fontWeight:700, fontSize:13, color:'#374151', marginBottom:6}}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width:'100%', padding:'12px 16px', border:'1.5px solid #E5E7EB',
                borderRadius:12, fontSize:14, direction:'ltr',
                outline:'none', transition:'border .15s'
              }}
              onFocus={e => e.target.style.borderColor = P}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {error && (
            <div style={{
              background:'#FEE2E2', color:'#991B1B', borderRadius:10,
              padding:'10px 14px', fontSize:13, marginBottom:16, fontWeight:600
            }}>
              ❌ {error === 'Invalid login credentials' ? 'البريد أو كلمة المرور غلط' : error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#E5E7EB' : grad,
              color:'#fff', border:'none', borderRadius:12,
              padding:'14px', width:'100%', fontSize:16, fontWeight:900,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,.4)',
              transition:'all .2s'
            }}
          >
            {loading ? 'جاري الدخول...' : 'دخول ☕'}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:20, fontSize:11, color:'#9CA3AF'}}>
          شركة مدينة فارس الرياضية — فرع نوره رجالي
        </div>
      </div>
    </div>
  )
}

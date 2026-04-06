import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!username.trim()) {
          throw new Error('El nombre de usuario es requerido');
        }
        const { error } = await signUp(email, password, username, fullName);
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 p-3 rounded-xl">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <p className="text-slate-400 text-center text-lg mb-1">
            Hola
          </p>
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            NEMAPA
          </h1>
          <p className="text-slate-300 text-center mb-8">
            Red social de proyectos creativos
          </p>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="usuario123"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre completo (opcional)
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Juan Pérez"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-slate-900 py-3 px-4 rounded-lg font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

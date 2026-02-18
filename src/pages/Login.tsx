import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.jpg';
import { toast } from 'sonner';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('E-mail ou senha incorretos');
      } else {
        navigate('/waiter');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-gold mb-6">
        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-2xl font-bold text-gold mb-2">Área do Garçom</h1>
      <p className="text-gold-burnt text-sm mb-8">
        {isSignUp ? 'Crie sua conta' : 'Faça login para gerenciar pedidos'}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-gold/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-card border border-gold/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-xl bg-card border border-gold/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gold text-primary-foreground font-bold hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-6 text-gold-burnt text-sm hover:text-gold transition-colors"
      >
        {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
      </button>

      <a href="/" className="mt-4 text-gold/50 text-xs hover:text-gold transition-colors">
        ← Ver cardápio
      </a>
    </div>
  );
};

export default Login;

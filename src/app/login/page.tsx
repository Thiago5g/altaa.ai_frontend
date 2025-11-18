"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin, signup } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signin(email, password);
      toast.success("Login realizado");
      router.replace("/dashboard");
    } catch {
      toast.error("Falha no login");
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, signupEmail, signupPassword);
      toast.success("Conta criada");
      router.replace("/dashboard");
    } catch {
      toast.error("Falha ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Acessar</h1>
          <p className="text-sm text-muted-foreground">Entre para continuar</p>
        </div>
        <form onSubmit={onLogin} className="space-y-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
          <Input type="password" placeholder="Senha" value={password} onChange={(e)=> setPassword(e.target.value)} />
          <Button className="w-full" disabled={loading}>Login</Button>
        </form>
        <div className="text-center">
          <Button type="button" variant="link" onClick={()=> setShowSignup(true)}>Novo usuário?</Button>
        </div>
      </div>

      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
          <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Criar conta</h2>
              <Button variant="ghost" onClick={()=> setShowSignup(false)}>Fechar</Button>
            </div>
            <form onSubmit={onSignup} className="space-y-4">
              <Input placeholder="Nome" value={name} onChange={(e)=> setName(e.target.value)} />
              <Input type="email" placeholder="Email" value={signupEmail} onChange={(e)=> setSignupEmail(e.target.value)} />
              <Input type="password" placeholder="Senha" value={signupPassword} onChange={(e)=> setSignupPassword(e.target.value)} />
              <Button className="w-full" disabled={loading}>Criar conta</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

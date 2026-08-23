"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  senha: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    // Aqui seria feita a requisição para a API
    console.log("Login submetido com sucesso", data);
    localStorage.setItem("paciente", JSON.stringify({ nome: "Rafael Silva", email: data.email }));
    router.push("/dashboard");
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>SaúdeMemora</h1>
        <p style={styles.subtitle}>Faça login para acessar seus exames</p>
        
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Email" 
              style={{ ...styles.input, borderColor: errors.email ? "var(--error)" : "var(--border)" }} 
              {...register("email")}
            />
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="Senha" 
              style={{ ...styles.input, borderColor: errors.senha ? "var(--error)" : "var(--border)" }} 
              {...register("senha")}
            />
            {errors.senha && <span style={styles.errorText}>{errors.senha.message}</span>}
          </div>
          
          <button type="submit" style={styles.button}>Entrar</button>
        </form>
        
        <div style={styles.footer}>
          <span>Não tem uma conta? </span>
          <a onClick={() => router.push("/cadastro")} style={styles.link}>Criar conta</a>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--background)", padding: "20px" },
  card: { backgroundColor: "var(--surface)", padding: "40px 24px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", width: "100%", maxWidth: "400px", textAlign: "center" },
  title: { fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", marginBottom: "8px" },
  subtitle: { fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "32px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" },
  input: { width: "100%", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", outline: "none", fontSize: "1rem" },
  errorText: { color: "var(--error)", fontSize: "0.75rem", textAlign: "left" },
  button: { padding: "12px", borderRadius: "var(--radius-md)", border: "none", backgroundColor: "var(--primary)", color: "white", fontSize: "1rem", fontWeight: 600, cursor: "pointer", width: "100%" },
  footer: { marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" },
  link: { color: "var(--primary)", cursor: "pointer", fontWeight: 500 }
};

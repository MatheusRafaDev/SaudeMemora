# 🏥 SaúdeMemora

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Spring%20Boot%20/%20.NET-API-6DB33F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-NoSQL-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-3448C5?style=for-the-badge&logo=cloudinary" />
  <img src="https://img.shields.io/badge/OCR-AI-blueviolet?style=for-the-badge" />
</p>

> **Digitalize, organize e acesse documentos médicos com inteligência.**  
> Aplicação que utiliza OCR + IA para transformar exames e receitas em dados estruturados.

## 🔗 Acesse o projeto

👉 https://saude-memora.vercel.app

---

## 🔐 Variáveis de Ambiente

| Categoria | Variáveis |
|----------|----------|
| **Frontend** | NEXT_PUBLIC_API_URL |
| **Banco de Dados (MongoDB)** | MongoDbSettings__ConnectionString, MongoDbSettings__DatabaseName |
| **Armazenamento de Imagens** | CloudinarySettings__CloudName, CloudinarySettings__ApiKey, CloudinarySettings__ApiSecret |
| **APIs externas** | GROQ_API_KEY, OCR_SPACE_API_KEY |
| **IA config** | IA_PROCESSING_MODE, IA_TIMEOUT_MS |
| **OCR config** | OCR_LANGUAGE, OCR_ENGINE |

---

## 🚀 Principais Benefícios

Com o **SaúdeMemora**, o usuário pode:

- 📄 Evitar a perda de exames e documentos importantes  
- 🩺 Manter todo o histórico médico organizado em um só lugar  
- ⚡ Acessar documentos rapidamente em consultas e emergências  
- 🔒 Garantir mais segurança e praticidade no armazenamento de dados de saúde  

---

## ⚙️ Funcionalidades

- Upload de documentos médicos (exames, receitas, prontuários) no Cloudinary
- Processamento OCR para extração automática de texto
- Organização dos documentos por tipo e paciente
- Consulta rápida ao histórico médico (salvos no MongoDB)
- Armazenamento estruturado e seguro

---

## 🛠️ Tecnologias Utilizadas

- OCR (Reconhecimento Óptico de Caracteres)
- Inteligência Artificial
- Next.js (Frontend) & ASP.NET Core (Backend)
- MongoDB (Banco de Dados NoSQL)
- Cloudinary (Armazenamento em Nuvem para Imagens)

---

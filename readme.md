# MVP - Sistema de Saúde

Este é o Produto Mínimo Viável (MVP) para um sistema de saúde, com funcionalidades essenciais para o registro de pacientes, agendamento de consultas, registro de atendimentos e controle de acesso.

## Funcionalidades do MVP

### 1. Cadastro de Pacientes
- Cadastro de pacientes com informações básicas: nome, CPF, data de nascimento, endereço, telefone e email.
- Tela de cadastro simples para inserção dos dados.

### 2. Agendamento de Consultas
- Agendamento de consultas médicas com data, horário e identificação do paciente.
- O recepcionista pode selecionar um paciente e agendar uma consulta para um horário específico.

### 3. Registro de Consultas Médicas
- Após a consulta, o médico pode registrar o diagnóstico e prescrição médica.
- A consulta é associada ao paciente e é salva no banco de dados.

### 4. Receitas Médicas
- Geração de receitas médicas, onde o médico pode prescrever medicamentos e informar a posologia.
- As receitas são vinculadas à consulta realizada.

### 5. Controle de Acesso
- Sistema de login para autenticação de usuários (admin, médico, recepcionista).
- Controle de permissões baseado no perfil do usuário.
  
## Banco de Dados

### 1. Tabela de Pacientes

```sql
-- Tabela de Pacientes
CREATE TABLE tb_pacientes (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ds_nome VARCHAR(255) NOT NULL,
    dt_nascimento DATE NOT NULL,
    ds_cpf VARCHAR(14) NOT NULL UNIQUE,
    ds_sexo ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    ds_telefone VARCHAR(20),
    ds_endereco VARCHAR(255),
    ds_email VARCHAR(255),
    ds_status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo'
);

-- Tabela de Consultas Médicas
CREATE TABLE tb_consultas (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_paciente_id BIGINT NOT NULL,
    dt_consulta DATE NOT NULL,
    ds_especialidade VARCHAR(255) NOT NULL,
    ds_medico_nome VARCHAR(255) NOT NULL,
    ds_crm_medico VARCHAR(20) NOT NULL,
    ds_diagnostico TEXT,
    ds_observacoes TEXT,
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Resultados de Exames
CREATE TABLE tb_resultados_exames (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_consulta_id BIGINT NOT NULL,
    ds_tipo_exame VARCHAR(255) NOT NULL,
    ds_resultado TEXT,
    dt_exame DATE NOT NULL,
    ds_observacoes TEXT,
    FOREIGN KEY (fk_consulta_id) REFERENCES tb_consultas(pk_Id)
);

-- Tabela de Receitas Médicas
CREATE TABLE tb_receitas (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_consulta_id BIGINT NOT NULL,
    ds_medicamento VARCHAR(255) NOT NULL,
    ds_dosagem VARCHAR(100),
    ds_posologia VARCHAR(255),
    ds_observacoes TEXT,
    dt_prescricao DATE NOT NULL,
    bl_retornada BOOLEAN DEFAULT FALSE,  -- Indica se o paciente retirou o medicamento
    FOREIGN KEY (fk_consulta_id) REFERENCES tb_consultas(pk_Id)
);

-- Tabela de Documentos de Prontuário
CREATE TABLE tb_documentos_prontuario (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_paciente_id BIGINT NOT NULL,
    ds_tipo_documento ENUM('Receita', 'Prontuário', 'Exame', 'Outro') NOT NULL,
    dt_upload DATE NOT NULL,
    ds_imagem VARCHAR(255),  -- Caminho para a imagem do documento
    ds_status_processamento ENUM('Processado', 'Falhou') DEFAULT 'Falhou',
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Usuários (para controle de acesso)
CREATE TABLE tb_usuarios (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ds_nome VARCHAR(255) NOT NULL,
    ds_email VARCHAR(255) NOT NULL UNIQUE,
    ds_senha VARCHAR(255) NOT NULL,
    ds_role ENUM('Administrador', 'Médico', 'Enfermeiro') NOT NULL,
    ds_status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo'
);

-- Tabela de Logs de Acesso (para monitoramento e auditoria)
CREATE TABLE tb_logs_acesso (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_usuario_id BIGINT NOT NULL,
    ds_acao ENUM('Login', 'Logout', 'Alteração', 'Erro') NOT NULL,
    ds_descricao TEXT,
    dt_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_usuario_id) REFERENCES tb_usuarios(pk_Id)
);


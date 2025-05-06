# Sistema de Gestão de Documentos e OCR


# Tarefas e Responsabilidades da Equipe

### Matheus
- **Tela de Cadastro de Paciente**  
  Responsável por criar o fluxo de cadastro, estrutura de campos e validações visuais.

- **Tela de Formulário Médico com OCR de ANAMNESE**  
  Coletar e registrar informações médicas do paciente, com campos para condições de saúde, histórico médico e perguntas sobre tratamentos, doenças e alergias.

### Gui
- **Tela de Editar Paciente**  
  Foco na exibição do paciente, visualização e edição das informações.

### Murilo
- **Tela de Cadastro de Documento**  
  Prototipar a interface de upload de documentos, seleção de tipo de documento e status de processamento.

### Lucas
- **Tela de Lista de Documentos**  
  Desenvolver o protótipo para exibição de documentos cadastrados, filtros e ações de visualização e exclusão.

### Ryan
- **Tela de Processamento OCR**  
  Foco no protótipo para exibição do processamento OCR, com texto extraído e interface para reprocessar documentos com falhas.

### Wilson
- **Tela de Relatório de Documentos**  
  Desenvolver o protótipo para relatórios detalhados sobre documentos, com filtros e opções de exportação (Excel/PDF).


## Visão Geral

O **Sistema de Gestão de Documentos e OCR** tem como objetivo automatizar o processo de captura, processamento e armazenamento de documentos através de OCR (Reconhecimento Óptico de Caracteres). O sistema permite a digitalização de documentos médicos (como receitas, exames e prontuários), extração de informações relevantes e armazenamento seguro no banco de dados, facilitando a gestão e o acesso a esses documentos.

## Funcionalidades

- **Captura de Documentos**: O sistema permite o envio e a captura de documentos físicos e digitais. O processo de captura pode ser realizado por meio de scanners ou uploads de arquivos digitais.
- **Processamento OCR**: Após a captura, os documentos são processados utilizando tecnologia OCR para extrair informações textuais dos documentos, como texto de receitas médicas, resultados de exames e detalhes de prontuários médicos, e coloca as informações em tabelas.
- **Armazenamento**: Os documentos processados são armazenados no banco de dados, com as informações extraídas e relacionadas a pacientes, garantindo fácil acesso e segurança.
- **Classificação de Documentos**: O sistema organiza os documentos de acordo com sua categoria, como "Receita", "Exame", "Prontuário", entre outros.
- **Gestão de Pacientes**: Cada documento processado é associado a um paciente, permitindo uma visualização fácil e organizada do histórico de documentos de cada paciente.
- **Relatórios e Consultas**: O sistema oferece funcionalidades de consulta e geração de relatórios com base nos documentos armazenados, incluindo filtros por tipo de documento, paciente, e status de processamento.

## Estrutura do Banco de Dados

O banco de dados do sistema será estruturado em várias tabelas principais para armazenar informações sobre os pacientes, documentos, e os resultados do OCR. A seguir, as principais tabelas do sistema:


## Telas do Sistema

### 1. **Tela de Cadastro de Paciente**
   - **Descrição**: Permite cadastrar novos pacientes no sistema, preenchendo informações como nome, CPF, data de nascimento, sexo, email, telefone e endereço.

### 2. **Tela de Lista de Pacientes**
   - **Descrição**: Exibe uma lista de pacientes cadastrados, com filtros por nome, CPF e status. Permite visualizar, editar ou excluir pacientes.

### 3. **Tela de Cadastro de Documento**
   - **Descrição**: Permite o cadastro de documentos médicos (receitas, exames, prontuários) relacionados aos pacientes, incluindo upload do arquivo e definição do status do processamento.

### 4. **Tela de Lista de Documentos**
   - **Descrição**: Exibe todos os documentos cadastrados no sistema, com filtros para tipo de documento, paciente e status de processamento. Permite visualizar ou excluir documentos.

### 5. **Tela de Processamento OCR**
   - **Descrição**: Mostra os resultados do processamento OCR, exibindo o texto extraído ou erros, e permitindo reprocessar documentos que falharam.

### 6. **Tela de Relatório de Documentos**
   - **Descrição**: Gera relatórios detalhados sobre os documentos, com filtros para tipo de documento, paciente, status e data. Permite exportar os dados para Excel ou PDF.

### 7. **Tela de Cadastro de Resultados de Exame**
   - **Descrição**: Permite cadastrar resultados de exames médicos, associando-os a um paciente, com campos para tipo de exame, resultado, data e médico responsável.

### 8. **Tela de Histórico de Consultas**
   - **Descrição**: Exibe o histórico de consultas de cada paciente, com descrição, data e médico responsável, além de permitir o cadastro de novas consultas.


### Tabela de Pacientes
Esta tabela armazena informações gerais sobre os pacientes, como nome, CPF, data de nascimento, sexo, entre outros.

```sql
-- Tabela de Pacientes
CREATE TABLE tb_pacientes (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,      -- Identificador único do paciente
    ds_nome VARCHAR(255) NOT NULL,                 -- Nome completo do paciente
    ds_cpf VARCHAR(14) NOT NULL UNIQUE,            -- CPF do paciente
    ds_data_nascimento DATE,                       -- Data de nascimento do paciente
    ds_email VARCHAR(255),                         -- Email do paciente
    ds_telefone VARCHAR(20),                       -- Telefone do paciente
    ds_endereco VARCHAR(255),                      -- Endereço do paciente
    ds_sexo ENUM('Masculino', 'Feminino', 'Outro') -- Sexo do paciente
);

-- Tabela de Documentos
CREATE TABLE tb_documentos (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- Identificador único do documento
    fk_paciente_id BIGINT,                            -- Relacionamento com a tabela de pacientes
    ds_tipo_documento ENUM('Receita', 'Exame', 'Prontuário', 'Outros') NOT NULL, -- Tipo de documento
    ds_url_arquivo VARCHAR(255) NOT NULL,             -- URL do arquivo digitalizado
    ds_status ENUM('Em processamento', 'Finalizado', 'Falhou') NOT NULL, -- Status do processamento do documento
    ds_data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de upload
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de OCR (Processamento dos documentos)
CREATE TABLE tb_ocr_documentos (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,          -- Identificador único do OCR
    fk_paciente_id BIGINT,                            -- Relacionamento com paciente
    fk_documento_id BIGINT,                           -- Relacionamento com o documento
    ds_status ENUM('Processado', 'Falhou') NOT NULL,  -- Status do OCR
    ds_texto_extraido TEXT,                           -- Texto extraído pelo OCR
    ds_erro TEXT,                                     -- Descrição do erro, se ocorrer
    dt_processamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data do processamento do OCR
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id),
    FOREIGN KEY (fk_documento_id) REFERENCES tb_documentos(pk_Id)
);

-- Tabela de Resultados de Exames
CREATE TABLE tb_resultados_exames (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único do resultado do exame
    fk_paciente_id BIGINT,                           -- Relacionamento com paciente
    ds_tipo_exame VARCHAR(255),                      -- Tipo de exame (ex: Exame de sangue, Raio-X)
    ds_resultado TEXT,                               -- Resultado do exame
    ds_data_exame DATE,                              -- Data de realização do exame
    ds_medico_responsavel VARCHAR(255),              -- Nome do médico responsável pelo exame
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Receitas Médicas
CREATE TABLE tb_receitas (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único da receita
    fk_paciente_id BIGINT,                           -- Relacionamento com paciente
    ds_medicamento VARCHAR(255),                     -- Nome do medicamento prescrito
    ds_dosagem VARCHAR(255),                         -- Dosagem do medicamento
    ds_frequencia VARCHAR(255),                      -- Frequência de uso do medicamento
    ds_duracao VARCHAR(255),                         -- Duração do tratamento
    ds_data_prescricao DATE,                         -- Data da prescrição médica
    ds_medico_responsavel VARCHAR(255),              -- Médico responsável pela receita
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Histórico de Consultas
CREATE TABLE tb_historico_consultas (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único da consulta
    fk_paciente_id BIGINT,                           -- Relacionamento com paciente
    ds_consulta TEXT,                                -- Descrição da consulta
    ds_data_consulta DATE,                           -- Data da consulta
    ds_medico_responsavel VARCHAR(255),              -- Médico responsável pela consulta
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Diagnósticos
CREATE TABLE tb_diagnosticos (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único do diagnóstico
    fk_paciente_id BIGINT,                           -- Relacionamento com paciente
    ds_diagnostico TEXT,                             -- Descrição do diagnóstico médico
    ds_data_diagnostico DATE,                        -- Data do diagnóstico
    ds_medico_responsavel VARCHAR(255),              -- Médico responsável pelo diagnóstico
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Arquivos (para outros arquivos relacionados ao paciente)
CREATE TABLE tb_arquivos (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único do arquivo
    fk_paciente_id BIGINT,                           -- Relacionamento com paciente
    ds_tipo_arquivo VARCHAR(255),                    -- Tipo de arquivo (Ex: Foto, Documentos adicionais)
    ds_url_arquivo VARCHAR(255),                     -- URL do arquivo
    ds_data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de upload
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

-- Tabela de Configurações do Sistema
CREATE TABLE tb_configuracoes (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único da configuração
    ds_nome VARCHAR(255) NOT NULL,                    -- Nome da configuração
    ds_valor VARCHAR(255) NOT NULL                    -- Valor da configuração (exemplo: caminho do OCR, limite de tamanho de upload)
);

-- Tabela de Logs de OCR (caso precise registrar eventos do processo OCR)
CREATE TABLE tb_logs_ocr (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,         -- Identificador único do log
    fk_documento_id BIGINT,                          -- Relacionamento com o documento processado
    ds_mensagem TEXT,                                -- Mensagem do log
    ds_data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e hora do log
    FOREIGN KEY (fk_documento_id) REFERENCES tb_documentos(pk_Id)
);

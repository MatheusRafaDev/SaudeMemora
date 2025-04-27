# Sistema de Gestão de Documentos e OCR

## Visão Geral

O **Sistema de Gestão de Documentos e OCR** tem como objetivo automatizar o processo de captura, processamento e armazenamento de documentos através de OCR (Reconhecimento Óptico de Caracteres). O sistema permite a digitalização de documentos médicos (como receitas, exames e prontuários), extração de informações relevantes e armazenamento seguro no banco de dados, facilitando a gestão e o acesso a esses documentos.

## Funcionalidades

- **Captura de Documentos**: O sistema permite o envio e a captura de documentos físicos e digitais. O processo de captura pode ser realizado por meio de scanners ou uploads de arquivos digitais.
- **Processamento OCR**: Após a captura, os documentos são processados utilizando tecnologia OCR para extrair informações textuais dos documentos, como texto de receitas médicas, resultados de exames e detalhes de prontuários médicos.
- **Armazenamento**: Os documentos processados são armazenados no banco de dados, com as informações extraídas e relacionadas a pacientes, garantindo fácil acesso e segurança.
- **Classificação de Documentos**: O sistema organiza os documentos de acordo com sua categoria, como "Receita", "Exame", "Prontuário", entre outros.
- **Gestão de Pacientes**: Cada documento processado é associado a um paciente, permitindo uma visualização fácil e organizada do histórico de documentos de cada paciente.
- **Relatórios e Consultas**: O sistema oferece funcionalidades de consulta e geração de relatórios com base nos documentos armazenados, incluindo filtros por tipo de documento, paciente, e status de processamento.

## Tecnologias Utilizadas

- **Frontend**: O frontend será construído utilizando **HTML**, **CSS** e **JavaScript** para uma interface amigável.
- **Backend**: O backend será desenvolvido em **Spring Boot** com **Java**, utilizando o padrão **MVC** para a estruturação das funcionalidades.
- **Banco de Dados**: O banco de dados será gerido por **MySQL** ou **PostgreSQL** para garantir alta performance e integridade dos dados.
- **OCR**: A tecnologia de OCR será implementada utilizando bibliotecas como **Tesseract OCR** ou APIs de terceiros (ex: Google Cloud Vision API) para o reconhecimento de texto nas imagens dos documentos.

## Estrutura do Banco de Dados

O banco de dados do sistema será estruturado em várias tabelas principais para armazenar informações sobre os pacientes, documentos, e os resultados do OCR. A seguir, as principais tabelas do sistema:

### `tb_pacientes`

Esta tabela armazena informações sobre os pacientes.

| Coluna          | Tipo        | Descrição                                            |
|-----------------|-------------|------------------------------------------------------|
| **pk_Id**       | `BIGINT`    | Identificador único do paciente (chave primária).    |
| **ds_nome**     | `VARCHAR`   | Nome completo do paciente.                           |
| **ds_cpf**      | `VARCHAR`   | CPF do paciente.                                     |
| **ds_data_nascimento** | `DATE`   | Data de nascimento do paciente.                     |
| **ds_email**    | `VARCHAR`   | Email do paciente.                                   |
| **ds_telefone** | `VARCHAR`   | Telefone do paciente.                                |

### `tb_documentos_prontuario`

Armazena os documentos digitalizados e seus detalhes.

| Coluna          | Tipo        | Descrição                                            |
|-----------------|-------------|------------------------------------------------------|
| **pk_Id**       | `BIGINT`    | Identificador único do documento (chave primária).   |
| **fk_paciente_id** | `BIGINT`  | Relacionamento com o paciente (chave estrangeira).    |
| **ds_tipo_documento** | `ENUM` | Tipo de documento (ex: Receita, Exame, Prontuário).  |
| **ds_url_arquivo** | `VARCHAR` | URL para o arquivo digital do documento.             |
| **ds_status**   | `ENUM`      | Status do documento (ex: 'Em Processamento', 'Finalizado'). |
| **ds_data_upload** | `TIMESTAMP` | Data e hora do upload do documento.               |

### `tb_ocr_documentos`

Armazena os resultados do OCR realizado nos documentos.

| Coluna          | Tipo        | Descrição                                            |
|-----------------|-------------|------------------------------------------------------|
| **pk_Id**       | `BIGINT`    | Identificador único do documento OCR (chave primária). |
| **fk_paciente_id** | `BIGINT`  | Relacionamento com o paciente.                       |
| **fk_documento_id** | `BIGINT` | Relacionamento com o documento que foi processado.   |
| **ds_status**   | `ENUM`      | Status do OCR (ex: 'Processado', 'Falhou').          |
| **ds_texto_extraido** | `TEXT` | Texto extraído pelo OCR.                             |
| **ds_erro**     | `TEXT`      | Descrição de erro, se houver falha no OCR.           |
| **dt_processamento** | `TIMESTAMP` | Data e hora de processamento do OCR.             |

### Script Completo de Criação do Banco de Dados

```sql
CREATE TABLE tb_pacientes (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ds_nome VARCHAR(255) NOT NULL,
    ds_cpf VARCHAR(14) NOT NULL,
    ds_data_nascimento DATE NOT NULL,
    ds_email VARCHAR(255),
    ds_telefone VARCHAR(20)
);

CREATE TABLE tb_documentos_prontuario (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_paciente_id BIGINT NOT NULL,
    ds_tipo_documento ENUM('Receita', 'Exame', 'Prontuário', 'Outro') NOT NULL,
    ds_url_arquivo VARCHAR(255) NOT NULL,
    ds_status ENUM('Em Processamento', 'Finalizado', 'Erro') NOT NULL,
    ds_data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id)
);

CREATE TABLE tb_ocr_documentos (
    pk_Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fk_paciente_id BIGINT NOT NULL,
    fk_documento_id BIGINT NOT NULL,
    ds_status ENUM('Processado', 'Falhou', 'Em Processamento') NOT NULL DEFAULT 'Em Processamento',
    ds_texto_extraido TEXT,
    ds_erro TEXT,
    dt_processamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_paciente_id) REFERENCES tb_pacientes(pk_Id),
    FOREIGN KEY (fk_documento_id) REFERENCES tb_documentos_prontuario(pk_Id)
);

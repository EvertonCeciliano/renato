

## Configuração do Banco de Dados

O projeto utiliza **MySQL** por padrão (ajuste conforme seu backend).

### **1. Instale o banco de dados (se não for usar Docker)**
- [Download MySQL](https://dev.mysql.com/downloads/installer/)

### **2. Crie o banco de dados**
Exemplo para MySQL:
```sql
CREATE DATABASE apple_manager;
```

### **3. Crie as tabelas**
No MySQL, conecte-se ao banco e execute:
```sql
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  menu_item_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```
> **Obs:** Se usar Docker, o banco será criado automaticamente.

---

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (e/ou na pasta `server/`):

```env
# Backend
DB_HOST=db
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=apple_manager
PORT=4001

# Frontend (se necessário)
VITE_API_URL=http://localhost:4001/api
```

- **Nunca compartilhe sua senha do banco em repositórios públicos!**
- Se usar Docker, as variáveis já estão no `docker-compose.yml` e são passadas automaticamente.

---

## Rodando com Docker (Recomendado)

### **1. Instale o Docker Desktop**
- [Download Docker](https://www.docker.com/products/docker-desktop/)

### **2. Configure o arquivo `.env`**
- Use o exemplo acima, ou apenas garanta que o `docker-compose.yml` está correto.

### **3. Suba os containers**
Na raiz do projeto, rode:
```bash
docker-compose up --build
```
- O Docker vai criar os containers do backend, frontend e banco de dados automaticamente.
- O banco de dados será inicializado com as tabelas necessárias.
- Logs de todos os serviços aparecerão no terminal.

### **4. Acesse a aplicação**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend/API: [http://localhost:4001/api](http://localhost:4001/api)
- MySQL: porta 3306 (padrão, pode ser alterada no `docker-compose.yml`)

### **5. Parar os containers**
```bash
docker-compose down
```

### **6. Dicas**
- Para reiniciar do zero (apagar volumes/dados do banco):
  ```bash
  docker-compose down -v
  ```

---

## Rodando Localmente (Node.js)

### 1. Clone ou copie o projeto

```bash
git clone https://github.com/EvertonCeciliano/renato.git
cd renato
```
Ou copie a pasta do projeto para o seu computador.

---

### 2. Instale as dependências

Na raiz do projeto:
```bash
npm install
```
Se o backend estiver em uma subpasta (ex: `server/`):
```bash
cd server
npm install
```

---

### 3. Configure as variáveis de ambiente

- Veja o exemplo acima e ajuste conforme seu ambiente.

---

### 4. Configure o banco de dados

- Instale o banco, crie o banco e as tabelas conforme instruções acima.

---

### 5. Rode o backend

No terminal, na pasta do backend (ex: `server/`):
```bash
npm start
```
ou
```bash
npm run dev
```
ou
```bash
node index.js
```
> O backend geralmente roda em `http://localhost:4001`

---

### 6. Rode o frontend

No terminal, na raiz do projeto:
```bash
npm run dev
```
> O frontend geralmente roda em `http://localhost:5173`

---

### 7. Acesse a aplicação

Abra o navegador e acesse:  
[http://localhost:5173](http://localhost:5173)

---

## Rodando o Frontend como Site Estático

Se quiser rodar só o frontend em qualquer PC (sem Node.js):

1. No seu PC, gere o build:

```bash
npm run build
```

2. Copie a pasta `dist/` para o outro PC.
3. Abra o arquivo `dist/index.html` em qualquer navegador.

> **Atenção:** O frontend só funcionará 100% se o backend estiver online e acessível.

---

## Deploy Online

### **Frontend (Vercel/Netlify)**
- Suba o projeto para o GitHub.
- Crie uma conta em [Vercel](https://vercel.com) ou [Netlify](https://netlify.com).
- Conecte seu repositório e siga as instruções da plataforma.
- Configure o build command como `npm run build` e publish directory como `dist`.

### **Backend (Render/Railway/Heroku)**
- Suba o backend para [Render](https://render.com), [Railway](https://railway.app) ou [Heroku](https://heroku.com).
- Configure as variáveis de ambiente e banco de dados conforme a plataforma.

---

## Dúvidas Frequentes e Solução de Problemas

**1. O que preciso instalar no PC para rodar?**  
- Docker Desktop (recomendado)  
- Ou Node.js e npm (caso não use Docker)

**2. Preciso de internet para rodar?**  
- Só para instalar dependências e, se usar banco de dados na nuvem ou deploy online.

**3. O que fazer se der erro de porta ocupada?**  
- Altere a porta no `.env` ou nos scripts do projeto.

**4. Como rodar só o frontend?**  
- Gere o build (`npm run build`) e abra o `dist/index.html` em qualquer navegador.

**5. Como rodar em outro PC?**  
- Copie o projeto, instale dependências, configure o banco e rode normalmente (ou use Docker).

**6. O backend não inicia, erro de banco de dados!**  
- Verifique se o banco está rodando, se as variáveis de ambiente estão corretas e se as tabelas existem.

**7. O frontend não encontra o backend!**  
- Verifique se o `API_URL` em `src/services/api.ts` ou `.env` está correto e se o backend está rodando.

**8. Como resetar o banco de dados?**  
- Apague as tabelas e rode os scripts SQL novamente, ou use `docker-compose down -v` para apagar tudo no Docker.

---

**Qualquer dúvida, abra uma issue ou pergunte para o desenvolvedor!**
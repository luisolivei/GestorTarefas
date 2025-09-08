📌 Gestor de Tarefas
-
O Gestor de Tarefas é uma aplicação Fullstack desenvolvida com React (frontend) e Node.js/Express (backend), que permite gerir tarefas de forma simples e organizada. Inclui funcionalidades de autenticação de utilizadores, criação, edição e eliminação de tarefas, bem como a exportaçao de relatórios em excel.

🚀 Funcionalidades:
-

🔐 Autenticação de utilizadores (registo, login e logout)

🍪 Armazenamento seguro do token em cookies HttpOnly

📝 Gestão de tarefas (criar, editar, apagar e listar)

📊 Geração de relatórios de tarefas

👤 Gestão de perfis de utilizador

🛡️ Middleware de segurança (JWT, sanitização de inputs, proteção contra XSS, upload seguro)

🛠️ Tecnologias Utilizadas
-
<b>Frontend:

- React

- Vite

- ESLint

- Tailwind.css

<b>Backend:

- Node.js

- Express

- MongoDB 

- JWT (JSON Web Tokens)
 (Cookies HttpOnly para autenticação) 

- Helmet (para cabeçalhos de segurança)

- Validator (para validação de inputs)

- XSS-clean (sanitização de dados, anti script)
 
- Middleware de upload seguro de avatar

📂 Estrutura do Projeto
-

GestorTarefas/

│── backend/              # API Node.js + Express

│   ├── config/           # Configuração da base de dados

│   ├── controllers/      # Lógica de autenticação, tarefas, relatórios

│   ├── middlewares/      # JWT, cookies, sanitização, XSS, upload

│   ├── models/           # Modelos (User, Task)

│   └── server.js         # Ponto de entrada do backend

│

│── frontend/Gestor-Tarefas/   # Aplicação React + Vite

│   ├── public/           # Recursos estáticos

│   ├── src/              # Componentes React

│   ├── package.json      # Dependências do frontend

│   └── vite.config.js    # Configuração do Vite

│
└── README.md


⚙️ Instalação e Execução🔧 Pré-requisitos
-
- Node.js (v18+)

- npm 

- Base de dados (MongoDB)

▶️ Backend:
cd backend/
npm install/
npm run dev

💻 Frontend:
cd frontend/Gestor-Tarefas/
npm install/
npm run dev


A aplicação ficará disponível em:

Frontend: http://localhost:5173/

Backend (API): http://localhost:5000/

⚙️ Configuração das Variáveis de Ambiente
-

Antes de iniciar o projeto, certifica-te que defines as variáveis de ambiente necessárias no ficheiro .env do backend nao enviadas por mim por questão de segurança.


PORT=

DB_URI=

JWT_SECRET=

COOKIE_SECRET=


🔒 Segurança:
-
✅ Tokens de autenticação guardados em cookies HttpOnly

✅ Proteção contra XSS (cross-site scripting)

✅ Sanitização de inputs antes de entrar na base de dados

✅ Helmet para reforçar cabeçalhos HTTP

✅ Validator.js para validação robusta de dados

✅ Proteção de rotas autenticadas


📌 Próximas Melhorias:
-
✅ Implementação de confirmação de email

✅ Testes automatizados (Jest / Vitest)

✅ Adicionar imagens ou ficheiros aos anexos da Tarefa


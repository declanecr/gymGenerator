# 🏋️‍♂️ Gym Generator

A full-stack workout tracker and generator built with NestJS, React, Prisma, and SQLite/PostgreSQL. This base version of the app will allow users to create accounts, log workouts, and generate custom exercise routines based on their goals.

---

## 🚀 Tech Stack

### Backend

- **Node.js** with **NestJS** (modular backend framework)
- **Prisma** ORM
- **SQLite** for development DB
- **PostgreSQL** for production DB
- **JWT + bcrypt** for authentication

### Frontend (in progress)

- **React** with Context API (Zustand fallback)
- **Material UI** for styling
- **React Hook Form + Zod** for forms and validation
- **Axios + React Query** for data fetching

---

## ✅ Features (in progress)

- [x] NestJS backend scaffolding
- [x] Prisma setup with SQLite
- [ ] Initial User model defined and migrated
- [ ] Auth module with JWT + bcrypt
- [ ] User signup & login endpoints
- [ ] Workout and Exercise models
- [ ] Workout logging and generator logic
- [ ] Responsive frontend dashboard

---

## 🗂️ Project Structure

```bash
gymGenerator/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── backend/
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma/
│   │   ├── dev.db
│   │   ├── dev.db-journal
│   │   ├── migrations/
│   │   │   ├── 20250515215410_init/
│   │   │   │   └── migration.sql
│   │   │   ├── 20250521235134_finalize_schema/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── README.md
│   ├── src/
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.DepInj.md
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── application.md
│   │   ├── main.ts
│   │   ├── modules/
│   │   │   ├── ReadME_modules.txt
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       │   └── auth.txt
│   │   │       └── users/
│   │   │           ├── dto/
│   │   │           │   ├── create-user.dto.ts
│   │   │           │   ├── login-user.dto.ts
│   │   │           │   ├── update-user.dto.ts
│   │   │           │   └── users-response.dto.ts
│   │   │           ├── users.controller.ts
│   │   │           ├── users.module.ts
│   │   │           └── users.service.ts
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       ├── prisma.service.spec.ts
│   │       └── prisma.service.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   └── vite.svg
│   ├── README.md
│   ├── src/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── LICENSE
├── notes/
│   ├── .obsidian/
│   │   ├── app.json
│   │   ├── appearance.json
│   │   ├── community-plugins.json
│   │   ├── core-plugins.json
│   │   ├── graph.json
│   │   ├── plugins/
│   │   │   ├── daily-activity/
│   │   │   │   ├── main.js
│   │   │   │   ├── manifest.json
│   │   │   │   └── styles.css
│   │   │   ├── daily-notes-editor/
│   │   │   │   ├── main.js
│   │   │   │   ├── manifest.json
│   │   │   │   └── styles.css
│   │   │   ├── obsidian-mind-map/
│   │   │   │   ├── main.js
│   │   │   │   └── manifest.json
│   │   │   ├── obsidian-tasks-plugin/
│   │   │   │   ├── main.js
│   │   │   │   ├── manifest.json
│   │   │   │   └── styles.css
│   │   │   ├── smart-connections/
│   │   │   │   ├── data.json
│   │   │   │   ├── main.js
│   │   │   │   ├── manifest.json
│   │   │   │   └── styles.css
│   │   │   └── table-editor-obsidian/
│   │   │       ├── data.json
│   │   │       ├── main.js
│   │   │       ├── manifest.json
│   │   │       └── styles.css
│   │   ├── templates.json
│   │   └── workspace.json
│   ├── .smart-env/
│   │   ├── multi/
│   │   │   ├── 00_INDEX_md.ajson
│   │   │   ├── 2025-05-20_md.ajson
│   │   │   ├── 2025-05-21_md.ajson
│   │   │   ├── 2025-05-22_md.ajson
│   │   │   ├── 2025-05-23_md.ajson
│   │   │   ├── 2025-05-26_md.ajson
│   │   │   ├── 2025-05-27_md.ajson
│   │   │   ├── 2025-05-28_md.ajson
│   │   │   ├── architecture_md.ajson
│   │   │   ├── backend_Authentication_Flow_md.ajson
│   │   │   ├── backend_Jest+Supertest_md.ajson
│   │   │   ├── backend_NestJS_md.ajson
│   │   │   ├── backend_NodeJS_md.ajson
│   │   │   ├── backend_Prisma_Error_Handling_Best_Practice_md.ajson
│   │   │   ├── backend_Prisma_md.ajson
│   │   │   ├── backend_SQLite-PostgreSQL_md.ajson
│   │   │   ├── backend_Untitled_md.ajson
│   │   │   ├── Cheatsheets_Bcrypt_md.ajson
│   │   │   ├── Cheatsheets_Determining_API_Actions_md.ajson
│   │   │   ├── Cheatsheets_Endpoint_Syntax_md.ajson
│   │   │   ├── Cheatsheets_HTTP_Actions_md.ajson
│   │   │   ├── Cheatsheets_Prisma_Cheatsheet_md.ajson
│   │   │   ├── Cheatsheets_Untitled_md.ajson
│   │   │   ├── CI-CD_md.ajson
│   │   │   ├── daily_2025-05-19_md.ajson
│   │   │   ├── daily_2025-05-20_md.ajson
│   │   │   ├── daily_2025-05-21_md.ajson
│   │   │   ├── daily_2025-05-22_1_md.ajson
│   │   │   ├── daily_2025-05-22_md.ajson
│   │   │   ├── daily_index_md.ajson
│   │   │   ├── Database_planning_API_planning_API-endpoint_planning_md.ajson
│   │   │   ├── Database_planning_API-endpoint_planning_md.ajson
│   │   │   ├── Database_planning_Database-Planning_md.ajson
│   │   │   ├── Database_planning_Prisma_Cheatsheet_md.ajson
│   │   │   ├── Database_planning_Templates-and-Instances_md.ajson
│   │   │   ├── Database_planning_Untitled_md.ajson
│   │   │   ├── DTO_vs_md.ajson
│   │   │   ├── DTO_vs_Mod,_Ser,_Con_md.ajson
│   │   │   ├── DTO_vs_Module-Service-Controller_md.ajson
│   │   │   ├── DTO_vs_Module,_Service,_Con_md.ajson
│   │   │   ├── DTO_vs_Modules,_Ser,_Con_md.ajson
│   │   │   ├── frontend_Axios-ReactQuery_md.ajson
│   │   │   ├── frontend_Context-Api_md.ajson
│   │   │   ├── frontend_MaterialUI_md.ajson
│   │   │   ├── frontend_React-Hook-Form_md.ajson
│   │   │   ├── frontend_React-Testing-Library+Jest_md.ajson
│   │   │   ├── frontend_ReactJS_md.ajson
│   │   │   ├── frontend_Zod_md.ajson
│   │   │   ├── issues_Prisma_Error_Handling_Best_Practice_md.ajson
│   │   │   ├── Meeting_with_Trey_md.ajson
│   │   │   ├── Obsidian_Callouts_md.ajson
│   │   │   ├── other_things_Client_md.ajson
│   │   │   ├── other_things_Dependency_Injection_md.ajson
│   │   │   ├── other_things_Fluent_API_md.ajson
│   │   │   ├── other_things_Mapping_to_a_DTO_class_md.ajson
│   │   │   ├── other_things_Meeting_with_Trey_md.ajson
│   │   │   ├── other_things_Migration_md.ajson
│   │   │   ├── other_things_Modules_md.ajson
│   │   │   ├── other_things_Non-Blocking_I-O_md.ajson
│   │   │   ├── other_things_Prisma_Error_Handling_Best_Practice_md.ajson
│   │   │   ├── other_things_Prisma-Generate_vs_Migrate_Dev_md.ajson
│   │   │   ├── other_things_Single_Thread_md.ajson
│   │   │   ├── other_things_type-safe_md.ajson
│   │   │   ├── other_things_Untitled_md.ajson
│   │   │   ├── TECH_STACK_md.ajson
│   │   │   ├── templates_daily-template_md.ajson
│   │   │   └── Untitled_md.ajson
│   │   └── smart_env.json
│   ├── 00_INDEX.md
│   ├── 2025-05-28.md
│   ├── architecture.md
│   ├── backend/
│   │   ├── Authentication_Flow.md
│   │   ├── Jest+Supertest.md
│   │   ├── NestJS.md
│   │   ├── NodeJS.md
│   │   ├── Prisma.md
│   │   └── SQLite-PostgreSQL.md
│   ├── Cheatsheets/
│   │   ├── bcrypt.md
│   │   ├── Determining API Actions.md
│   │   ├── Endpoint Syntax.md
│   │   ├── HTTP Actions.md
│   │   └── Prisma Cheatsheet.md
│   ├── CI-CD.md
│   ├── daily/
│   │   ├── 2025-05-19.md
│   │   ├── 2025-05-20.md
│   │   ├── 2025-05-21.md
│   │   ├── 2025-05-22.md
│   │   ├── 2025-05-23.md
│   │   ├── 2025-05-26.md
│   │   ├── 2025-05-27.md
│   │   └── index.md
│   ├── Database Planning/
│   │   ├── API-endpoint planning.md
│   │   ├── Database-Planning.md
│   │   └── Templates-and-Instances.md
│   ├── frontend/
│   │   ├── Axios-ReactQuery.md
│   │   ├── Context-Api.md
│   │   ├── MaterialUI.md
│   │   ├── React-Hook-Form.md
│   │   ├── React-Testing-Library+Jest.md
│   │   ├── ReactJS.md
│   │   └── Zod.md
│   ├── issues/
│   │   ├── Mapping to a DTO class.md
│   │   └── Prisma Error Handling Best Practice.md
│   ├── Obsidian/
│   │   └── Callouts.md
│   ├── other things/
│   │   ├── Client.md
│   │   ├── Dependency Injection.md
│   │   ├── DTO vs Module-Service-Controller.md
│   │   ├── Fluent API.md
│   │   ├── Meeting with Trey.md
│   │   ├── Migration.md
│   │   ├── Modules.md
│   │   ├── Non-Blocking I-O.md
│   │   ├── Prisma-Generate vs Migrate Dev.md
│   │   ├── Prisma.PrismaClientKnownRequestError.md
│   │   ├── Single Thread.md
│   │   └── type-safe.md
│   ├── TECH_STACK.md
│   └── templates/
│       └── daily-template.md
├── package-lock.json
├── package.json
└── README.md

```

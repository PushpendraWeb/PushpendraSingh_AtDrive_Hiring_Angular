## Test – Angular Application

This is an Angular 18 application generated with [Angular CLI](https://github.com/angular/angular-cli) version **18.2.21**.

It contains the following main feature modules/components (see `src/app`):
- `login` – login screen
- `dashboard` – main dashboard after login
- `product` – product‑related views
- `order` – order‑related views
- `weather` – sample weather UI
- shared services (`service/BaseService.service.ts`, `service/apiconstants.ts`) and a `toast` notification utility.

---

## Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (installed with Node)
- **Angular CLI**: 18.x

Install Angular CLI globally (if not already installed):

```bash
npm install -g @angular/cli@18
```

---

## 1. Clone the repository

```bash
git clone <repo-url>
cd PushpendraSingh_AtDrive_Hiring_Angular
```

Replace `<repo-url>` with the actual Git repository URL.

---

## 2. Install dependencies

From the project root:

```bash
npm install
```

This will install all dependencies defined in `package.json`.

---

## 3. Run the application (development server)

Start the dev server:

```bash
npm start
```

This runs:

```bash
ng serve --o
```

- The app will be served at `http://localhost:4200/`.
- The browser will open automatically.
- Any changes in the source files will trigger **live reload**.

If you prefer to run Angular CLI directly:

```bash
ng serve
```

---

## 4. Build for production

To create a production build:

```bash
npm run build
```

This runs:

```bash
ng build
```

- The output will be generated in the `dist/` folder.
- You can deploy the contents of `dist/` to any static web server.

---

## 5. Run unit tests

Run unit tests using Karma:

```bash
npm test
```

This runs:

```bash
ng test
```

---

## 6. Additional Angular CLI commands

Generate a new component:

```bash
ng generate component component-name
```

Other common schematics:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

---

## 7. Useful configuration files

- `angular.json` – Angular workspace & build configuration
- `tsconfig.json`, `tsconfig.app.json` – TypeScript configuration
- `src/main.ts` – application bootstrap
- `src/app/app.routes.ts` – main route definitions

For more Angular CLI commands and configuration options, see the official docs:  
`https://angular.dev/tools/cli`

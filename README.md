# Gestor de Correos Electrónicos con Filtros Dinámicos


## Consigna

Desarrollar en **TypeScript** un sistema de gestión de correos electrónicos que permita crear, enviar, buscar, organizar y filtrar mensajes.

El proyecto deberá integrar conceptos de:

- Programación Orientada a Objetos (POO).
- Programación Funcional.
- Principios SOLID.
- Desarrollo guiado por pruebas (TDD).
- Pruebas unitarias.
- Git y GitHub.
- Integración continua.

La lógica del dominio será modelada principalmente mediante POO, mientras que las búsquedas, filtros y procesamiento de colecciones utilizarán conceptos de Programación Funcional como funciones lambda, predicados, `map`, `filter` y `reduce`.

## Requerimientos funcionales

- **RF-01:** Creación de correos electrónicos.
- **RF-02:** Envío de correos electrónicos.
- **RF-03:** Gestión de contactos.
- **RF-04:** Búsqueda de correos electrónicos.
- **RF-05:** Creación y aplicación de filtros personalizados.
- **RF-06:** Gestión de bandejas y clasificación.
- **RF-07:** Gestión de borradores.
- **RF-08:** Marcar correos como leídos o no leídos.
- **RF-09:** Gestión de correos favoritos.
- **RF-10:** Procesamiento funcional y estadísticas.

## Organización del trabajo

El desarrollo se organizará en tres Sprints.

| Sprint | Objetivo principal | Persona 1 | Persona 2 |
|---|---|---|---|
| **Sprint 1** | Base del sistema y POO | RF-01 + RF-02 | RF-03 + RF-06 |
| **Sprint 2** | Búsqueda y Programación Funcional | RF-04 + RF-08 | RF-05 + RF-09 |
| **Sprint 3** | Cierre e integración | RF-07 + tests generales | RF-10 + documentación / CI |

Cada funcionalidad deberá estar acompañada por sus correspondientes pruebas unitarias y los avances deberán quedar registrados mediante commits en el repositorio.

## Estructura del proyecto

```text
Gestor-de-email/
├── src/
├── tests/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── vitest.config.mts
```

- `src/`: código fuente del proyecto.
- `tests/`: pruebas unitarias.
- `tsconfig.json`: configuración de TypeScript.
- `vitest.config.mts`: configuración de Vitest.
- `package.json`: dependencias y scripts del proyecto.

## Configuración inicial

Para crear y configurar el proyecto desde cero:

```bash
npm init -y
npm install -D typescript vitest
mkdir src
mkdir tests
npx tsc --init
```

Estos comandos permiten:

- Crear el archivo `package.json`.
- Instalar TypeScript y Vitest.
- Crear las carpetas `src` y `tests`.
- Generar el archivo `tsconfig.json`.

## Instalar dependencias

Si el repositorio ya fue clonado, ejecutar:

```bash
npm install
```

## Ejecutar los tests

```bash
npx vitest
```

También se podrá utilizar:

```bash
npm test
```

si el script está configurado en `package.json`.

## Verificar TypeScript

```bash
npx tsc --noEmit
```

## Metodología

El proyecto utilizará **TDD (Test Driven Development)**.

Para cada funcionalidad se seguirá el ciclo:

1. Crear el test.
2. Ejecutarlo y verificar que falle.
3. Implementar la funcionalidad.
4. Ejecutar nuevamente el test.
5. Verificar que pase correctamente.
6. Refactorizar el código cuando sea necesario.


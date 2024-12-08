# Portal Gestion ARL

Instrucciones para desplegar un proyecto de `Angular`

## Requisitos previos

- `Node.js v20.11.1`.
- `npm v10.2.4`
- `Angular CLI v17.3.0`

## Instalación dependencias

```
npm install
```

## Creación variables de entorno

Modificar los valores del `.env.template` antes de usar el siguiente script.

```
npm run envs
```

## Desplegar proyecto

`npm run build` internamente ejecuta `ng build`, la diferencia entre uno y el otro radica que `npm run build` ejecuta a su vez el script anterior.

```
npm run build
```

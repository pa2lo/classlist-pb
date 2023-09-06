# ClassList

Test project for PocketBase and Vue Router. In "dashboard" routes client subscribes to DB for real time updates.
Added custom MultiSelect component + renderComponent function to mount VUE components inside HTML content from TinyMCE.

## Demo
[Demo app](https://classlist.pa2lo.net)
Login to dashboard:
URL - https://classlist.pa2lo.net/login
username - demo@demo.demo
password - demo1234

## Project Setup

```sh
npm install
```

### DB Settings
PocketBase DB Schema in `pb_schema.json` file.
Set PocketBase DB URL to `VITE_PB_URL` variable in `.env` file.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

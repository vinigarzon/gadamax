# Agente de pedidos — demo técnica

Demostración funcional en `/pedido-demo/`. **No toca nada del sitio existente**:
son archivos nuevos en rutas nuevas. El único archivo modificado es
`package.json` (se agregó `@netlify/blobs`).

## Qué se agregó

```
public/pedido-demo/index.html          la consola web
netlify/functions/agente-pedido.mjs    pipeline en streaming (POST /api/agente-pedido)
netlify/functions/erp.mjs              consulta y escritura del ERP simulado (/api/erp)
netlify/functions/ejemplos.mjs         pedidos de muestra (/api/ejemplos)
netlify/lib/maestros.mjs               clientes, materiales, tasas, umbrales
netlify/lib/motor.mjs                  emparejamiento y reglas de negocio
netlify/lib/almacen.mjs                persistencia sobre Netlify Blobs
netlify/lib/ejemplos.mjs               los 5 pedidos de ejemplo
```

## Para desplegar

1. **Antes de subir nada**, en Netlify: Site configuration → Environment
   variables → agregar `ANTHROPIC_API_KEY` con la clave. Sin esto la página
   carga pero devuelve un error claro al procesar.
2. Habilitar Netlify Blobs en el sitio si no está activo (Site configuration →
   Blobs). En planes recientes viene activo por defecto.
3. `git add -A && git commit && git push`. Netlify reconstruye solo.
4. Verificar en `https://www.gadamax.com/pedido-demo/`.

> Si `git add` falla con "Unable to create index.lock", correr antes
> `rm -f .git/index.lock`.

## Qué es real y qué está simulado

**Real:** la lectura del pedido la hace Claude en vivo con salida estructurada;
el emparejamiento y las reglas corren en código determinista; los documentos
generados se guardan en Netlify Blobs y sobreviven a recargas y a otros equipos.

**Simulado:** los maestros de clientes y materiales, y los dos sistemas de
destino (SAP y ERP Ecuador). Se generan los payloads con la estructura correcta
—`BAPI_SALESORDER_CREATEFROMDAT2` para SAP— pero no se envían a ningún sistema.

## Para reemplazar con datos reales

Todo lo específico del cliente vive en `netlify/lib/maestros.mjs`. Con un
extracto de MARA/KNA1 (o el equivalente del ERP de Ecuador) se reemplaza ese
archivo y el motor no cambia una línea.

## Supuesto pendiente de confirmar

`destinos()` en `motor.mjs` asume que los pedidos de Ecuador se cargan a SAP
**y** al ERP local, y los de Colombia solo a SAP. Si no es así, se cambia esa
función y nada más.

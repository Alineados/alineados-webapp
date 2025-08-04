# 🚀 Endpoints Disponibles - Pillars API

## 📋 Información General

**Base URL:** `http://localhost:8080/api/v1/pillars`  
**Servidor:** Go (Fiber)  
**Base de Datos:** MongoDB  
**Puerto:** 8080

---

## 📡 Endpoints Disponibles

### **1. Obtener Todos los Pilares**
```
GET /api/v1/pillars/get-all
```

**Descripción:** Obtiene todos los pilares y categorías para un usuario específico.

**Query Parameters:**
- `uid` (string, requerido): ID del usuario

**Ejemplo:**
```bash
GET http://localhost:8080/api/v1/pillars/get-all?uid=user123
```

**Respuesta:**
```json
{
  "data": {
    "health": {
      "id": "pillar_id",
      "name": "Health",
      "label": "Salud",
      "categories": [
        {
          "id": "category_id",
          "label": "Ejercicio",
          "name": "Fitness",
          "active": true,
          "state": 3,
          "priority": 2,
          "security": false
        }
      ]
    },
    "relational": { ... },
    "vocational": { ... },
    "spiritual": { ... }
  },
  "message": "Pillars retrieved successfully",
  "status": 200
}
```

---

### **2. Actualizar Estado de Categoría**
```
POST /api/v1/pillars/update-category-state
```

**Descripción:** Actualiza solo el campo `active` de una categoría.

**Query Parameters:**
- `uid` (string, requerido): ID del usuario
- `pillar_type` (string, requerido): Tipo de pilar (health, relational, vocational, spiritual)
- `category_id` (string, requerido): ID de la categoría
- `active` (boolean, requerido): Nuevo estado activo/inactivo

**Ejemplo:**
```bash
POST http://localhost:8080/api/v1/pillars/update-category-state?uid=user123&pillar_type=health&category_id=507f1f77bcf86cd799439011&active=true
```

**Respuesta:**
```json
{
  "message": "Category state updated successfully",
  "status": 200
}
```

---

### **3. ✅ Actualizar Categoría Completa (EN USO)**
```
POST /api/v1/pillars/update-category
```

**Descripción:** Actualiza todos los campos de una categoría (endpoint en uso actualmente).

**Query Parameters:**
- `pillar_type` (string, requerido): Tipo de pilar (health, relational, vocational, spiritual)
- `uid` (string, requerido): ID del usuario

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "label": "Ejercicio",
  "name": "Fitness",
  "active": true,
  "state": 3,
  "priority": 2,
  "security": false
}
```

**Validaciones:**
- `state`: Entre 1-3 (1=SadFace, 2=MedFace, 3=HappyFace)
- `priority`: Entre 0-3 (0=sin estrellas, 1-3=estrellas)
- `id`: Formato ObjectID válido
- `pillar_type`: health, relational, vocational, spiritual

**Ejemplo:**
```bash
POST http://localhost:8080/api/v1/pillars/update-category?pillar_type=health&uid=user123
Content-Type: application/json

{
  "id": "507f1f77bcf86cd799439011",
  "label": "Ejercicio",
  "name": "Fitness",
  "active": true,
  "state": 3,
  "priority": 2,
  "security": false
}
```

**Respuesta:**
```json
{
  "message": "Category updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "label": "Ejercicio",
    "name": "Fitness",
    "active": true,
    "state": 3,
    "priority": 2,
    "security": false
  }
}
```

**Nota:** Este endpoint actualiza todos los campos de la categoría, incluyendo `state` y `priority`.

---

### **4. Actualizar Información de Categoría**
```
POST /api/v1/pillars/update-category-info?pillar=health
```

**Descripción:** Actualiza la información detallada de una categoría (arrays, memorias, etc.).

**Query Parameters:**
- `pillar` (string, requerido): Tipo de pilar

**Request Body:**
```json
{
  "id": "object_id",
  "cid": "category_id",
  "uid": "user_id",
  "is_current": true,
  "elements": [...],
  "objectives": [...],
  "positive_actions": [...],
  "improve_actions": [...],
  "habits": [...],
  "short_actions": [...],
  "middle_actions": [...],
  "long_actions": [...],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### **5. Obtener Información de Categoría**
```
GET /api/v1/pillars/get-category-info
```

**Descripción:** Obtiene la información detallada de una categoría.

**Query Parameters:**
- `pillar` (string, requerido): Tipo de pilar
- `cid` (string, requerido): ID de la categoría
- `uid` (string, requerido): ID del usuario
- `is_current` (boolean, opcional): Por defecto true

**Ejemplo:**
```bash
GET http://localhost:8080/api/v1/pillars/get-category-info?pillar=health&cid=category_id&uid=user123&is_current=true
```

---

### **6. Test Endpoint**
```
GET /api/v1/pillars/test-users
```

**Descripción:** Endpoint de prueba para verificar que el servidor está funcionando.

**Ejemplo:**
```bash
GET http://localhost:8080/api/v1/pillars/test-users
```

---

## 🗄️ Estructura de Base de Datos

### **Colecciones por Pilar:**
- `pillar_health.categories` - Categorías de salud
- `pillar_relational.categories` - Categorías de relaciones
- `pillar_vocational.categories` - Categorías vocacionales
- `pillar_spiritual.categories` - Categorías espirituales

### **Colecciones de Información:**
- `pillar_health.cat_info` - Información detallada de categorías de salud
- `pillar_relational.cat_info` - Información detallada de categorías de relaciones
- `pillar_vocational.cat_info` - Información detallada de categorías vocacionales
- `pillar_spiritual.cat_info` - Información detallada de categorías espirituales

---

## 🔧 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | ✅ Éxito |
| 400 | ❌ Bad Request (datos inválidos) |
| 401 | ❌ Unauthorized |
| 404 | ❌ Not Found (categoría no encontrada) |
| 500 | ❌ Internal Server Error |

---

## 🎯 Ejemplos de Uso

### **Postman Collection:**
```json
{
  "name": "Pillars API",
  "item": [
    {
      "name": "Get All Pillars",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/v1/pillars/get-all?uid=user123"
      }
    },
    {
      "name": "Update Category",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/pillars/update-category?pillar_type=health&uid=user123",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"id\": \"507f1f77bcf86cd799439011\",\n  \"label\": \"Ejercicio\",\n  \"name\": \"Fitness\",\n  \"active\": true,\n  \"state\": 3,\n  \"priority\": 2,\n  \"security\": false\n}"
        }
      }
    }
  ]
}
```

---

## 🚀 Cómo Ejecutar

### **Backend:**
```bash
cd alineados_services_acciones_relaciones
go run main.go
```

### **Verificar que está funcionando:**
```bash
curl http://localhost:8080/api/v1/pillars/test-users
```

---

## 📝 Notas de Desarrollo

### **Validaciones Implementadas:**
- ✅ **State:** Entre 1-3
- ✅ **Priority:** Entre 0-3
- ✅ **ObjectID:** Formato válido
- ✅ **Pillar Type:** Valores permitidos
- ✅ **Campos requeridos:** Validación completa

### **Características:**
- ✅ **Retry automático:** 3 intentos en caso de error
- ✅ **Logging:** Errores detallados
- ✅ **Validaciones:** Frontend y backend
- ✅ **Mensajes:** Respuestas descriptivas

---

**Última actualización:** Agosto 2024  
**Estado:** ✅ Implementado y funcional 
---
name: epn-ui-design
description: Sistema de diseño institucional EPN para aplicaciones móviles en Expo + React Native + TypeScript. Define tokens de color, tipografía, componentes y patrones visuales con estética Apple/minimalista.
---

# Sistema de Diseño EPN - UI Design System

## Paleta de Colores Institucional EPN

### Colores Primarios
| Token | Hex | Uso |
|-------|-----|-----|
| epnRed | #C8102E | Rojo institucional EPN - botones CTA, acciones principales |
| epnBlue | #003087 | Azul institucional EPN - links, iconos, estados secundarios |
| epnBlack | #0A0A0A | Texto principal, elementos oscuros |
| epnWhite | #F5F5F7 | Fondos claros, superficie |
| epnYellow | #FFD100 | Acentos puntuales (badges, alertas informativas) |

### Neutros (Estilo Apple)
| Token | Hex | Uso |
|-------|-----|-----|
| gray100 | #F5F5F7 | Fondo de pantalla principal |
| gray200 | #E8E8ED | Bordes sutiles, divisores |
| gray300 | #D1D1D6 | Estados deshabilitados |
| gray500 | #8E8E93 | Texto secundario |
| gray700 | #3A3A3C | Texto de soporte |
| gray900 | #1C1C1E | Texto principal oscuro |

## Tipografía

### Familia
- Usar System font por defecto en React Native (San Francisco en iOS, Roboto en Android)
- No definir	fontFamily explícitamente

### Tamaños
| Token | px | Uso |
|-------|-----|-----|
| largeTitle | 34 | Títulos principales de pantalla |
| title1 | 28 | Encabezados de sección |
| title2 | 22 | Subtítulos |
| body | 17 | Texto principal |
| subhead | 15 | Texto secundario |
| caption | 13 | Etiquetas, metadata |

### Pesos
| Token | Value | Uso |
|-------|-------|-----|
| light | '300' | Texto suave |
| regular | '400' | Texto estándar |
| semibold | '600' | Énfasis |
| bold | '700' | Títulos, etiquetas |

## Espaciado y Bordes

### Espaciado Base (escala de 8px)
| Token | px |
|-------|-----|
| xs | 4 |
| sm | 8 |
| md | 12 |
| lg | 16 |
| xl | 20 |
| 2xl | 24 |
| 3xl | 32 |
| 4xl | 40 |
| 5xl | 48 |

### Border Radius
| Token | px |
|-------|-----|
| small | 8 |
| medium | 12 |
| large | 16 |
| pill | 999 |

### Sombras
- Solo应用于 tarjetas
- shadowOpacity: 0.08
- shadowRadius: 12
- shadowColor: #000
- shadowOffset: { width: 0, height: 2 }

## Guías de Implementación

### Screens Principales
- Fondo de pantalla: gray100 (#F5F5F7)
- Usar SafeAreaView para manage área segura

### Headers y Navigation Bars
- Color de fondo: epnRed (#C8102E) o epnBlue (#003087)
- Texto: blanco (#FFFFFF)
- Usar estilo minimalista, sin gradientes

### Botones Primarios
- Fondo: epnRed (#C8102E)
- Texto: blanco, weight semibold
- Border radius: medium (12)
- Padding: 16 vertical, 24 horizontal
- Height mínimo: 48

### Inputs
- Borde: gray300 (#D1D1D6)
- Fondo: white (#FFFFFF) o gray100 (#F5F5F7)
- Border radius: small (10)
- Padding: 12
- Focus state: borde epnBlue (#003087)

### Tarjetas
- Fondo: white (#FFFFFF)
- Border radius: large (16)
- Sombra sutil: opacity 0.08, radius 12
- Padding: 16

### Texto
- Jerarquía clara usando los tamaños definidos
- body (17) para texto principal
- caption (13) para etiquetas
- gray500 para texto secundario

### Modo Claro (Default)
- Fondos principales: gray100 (#F5F5F7)
- Superficies: white (#FFFFFF)

## Reglas de Estilo
- Estética minimalista, limpia, estilo Apple
- Mucho espacio en blanco
- Sin elementos recargados
- NO cambiar lógica de negocio
- NO cambiar nombres de archivos existentes
- NO cambiar rutas de navegación
- Solo modificar estilos: colores, fuentes, espaciados, bordes, sombras

## Logo EPN
- Ubicación: `assets/epn-logo.png`
- Uso: Vista previa del CV, pantalla principal, splash
- Tamaño recomendado: 120x120 para avatares, 200x200 para headers
- Estilo: Fondo transparente, color o blanco según contraste

## Mejoras UI Adicionales (v2)
- Logo EPN en header de vista previa del CV
- Gradientes sutiles en headers (opcional, usar con moderación)
- Animaciones de transición suaves (0.3s ease)
- Estados de presión (activeOpacity) en botones
- Indicadores visuales de progreso en cada sección
- Badge de estado en tarjetas (completado/pendiente)
- Iconos SF symbols style o similares
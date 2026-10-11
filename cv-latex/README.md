# CV en LaTeX

Fuente del CV descargable de malb.dev.

| Archivo | Se publica como |
|---|---|
| `Manuel_Barra_Lazo_CV_ES.tex` | `public/cv/Manuel_Barra_Lazo_CV_2026.pdf` (ES y CA) |
| `Manuel_Barra_Lazo_CV_EN.tex` | `public/cv/Manuel_Barra_Lazo_Resume_2026_EN.pdf` (EN) |

Compilar con `pdflatex` (dos pasadas) o subir el `.tex` a Overleaf. Solo usa paquetes estándar de TeX Live (`charter`, `titlesec`, `enumitem`, `tabularx`, `hyperref`).

Al cambiar datos, actualiza también `src/data/resume.json` para que la web, la ruta `/cv` y el PDF digan lo mismo.

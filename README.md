# TYPICAL — сайт

Статический сайт TYPICAL (страница «Проекты»).

## Структура
- `project.html` — страница
- `assets/` — стили (`tokens.css`, `project.css`, `fonts.css`), скрипты, логотипы, изображения отзывов

## Деплой
Разворачивается на [Render](https://render.com) как статический сайт по `render.yaml`.
Корневой адрес `/` отдаёт `project.html`.

Локально достаточно открыть `project.html` в браузере или поднять любой статик-сервер:

```bash
python3 -m http.server 8000
# → http://localhost:8000/project.html
```

# Автоматизированная система управления доением коров

Современная веб-система для управления роботизированными доильными установками с возможностями мониторинга, аналитики и управления стадом.

## 🚀 Возможности системы

### Основной функционал
- **Панель управления** - мониторинг в реальном времени
- **Управление стадом** - учет коров, RFID-идентификация
- **Управление роботами** - контроль доильных роботов
- **Аналитика** - отчеты и статистика производительности
- **Настройки** - конфигурация системы

### Технические возможности
- Автоматическая идентификация коров по RFID-меткам
- Система машинного зрения для визуального распознавания
- Мониторинг качества молока в реальном времени
- Экспорт отчетов в PDF и Excel форматах
- Система уведомлений и алертов
- Резервное копирование данных

## 🛠 Технологический стек

- **Frontend**: React 18 + TypeScript
- **Стилизация**: Tailwind CSS
- **Иконки**: Lucide React
- **Сборка**: Vite
- **Линтинг**: ESLint

## 📋 Требования к системе

### Минимальные требования
- Node.js 18.0 или выше
- npm 8.0 или выше
- 4 ГБ оперативной памяти
- 10 ГБ свободного места на диске

### Рекомендуемые требования
- Node.js 20.0 или выше
- npm 10.0 или выше
- 8 ГБ оперативной памяти
- 50 ГБ свободного места на диске
- SSD накопитель

## 🚀 Установка и запуск

### Разработка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd milking-system
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Запуск в режиме разработки**
```bash
npm run dev
```

Система будет доступна по адресу: http://localhost:5173

### Сборка для производства

1. **Создание production сборки**
```bash
npm run build
```

2. **Предварительный просмотр production сборки**
```bash
npm run preview
```

## 🏭 Развертывание в производственной среде

### Вариант 1: Развертывание на сервере с Nginx

1. **Подготовка сервера**
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Nginx
sudo apt install nginx -y

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

2. **Клонирование и настройка проекта**
```bash
# Переход в директорию веб-сервера
cd /var/www

# Клонирование проекта
sudo git clone <repository-url> milking-system
cd milking-system

# Установка зависимостей
sudo npm install

# Сборка проекта
sudo npm run build
```

3. **Настройка Nginx**
```bash
# Создание конфигурации Nginx
sudo nano /etc/nginx/sites-available/milking-system
```

Содержимое файла конфигурации:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Замените на ваш домен
    
    root /var/www/milking-system/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;  # Если есть backend API
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

4. **Активация конфигурации**
```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/milking-system /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Вариант 2: Развертывание с Docker

1. **Создание Dockerfile**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Создание docker-compose.yml**
```yaml
version: '3.8'

services:
  milking-system:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx
```

3. **Запуск контейнера**
```bash
docker-compose up -d
```

### Вариант 3: Развертывание на облачных платформах

#### Netlify
1. Подключите репозиторий к Netlify
2. Настройте команды сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. Выполните развертывание: `vercel --prod`

## 🔧 Конфигурация системы

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Основные настройки
VITE_APP_TITLE=AgroBot Milking System
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001

# Настройки безопасности
VITE_ENABLE_HTTPS=false
VITE_SESSION_TIMEOUT=3600

# Настройки мониторинга
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=info
```

### Настройка базы данных (опционально)

Если планируется интеграция с базой данных:

```bash
# PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb milking_system

# MongoDB
sudo apt install mongodb
```

## 📊 Мониторинг и логирование

### Настройка логирования

1. **Создание директории для логов**
```bash
sudo mkdir -p /var/log/milking-system
sudo chown www-data:www-data /var/log/milking-system
```

2. **Настройка ротации логов**
```bash
sudo nano /etc/logrotate.d/milking-system
```

Содержимое файла:
```
/var/log/milking-system/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### Мониторинг системы

Рекомендуется использовать:
- **Prometheus + Grafana** для метрик
- **ELK Stack** для логов
- **Uptime Robot** для мониторинга доступности

## 🔒 Безопасность

### Рекомендации по безопасности

1. **Настройка файрвола**
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

2. **SSL сертификат (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

3. **Регулярные обновления**
```bash
# Создание скрипта автообновления
sudo nano /etc/cron.daily/system-update
```

### Резервное копирование

Настройка автоматического резервного копирования:

```bash
#!/bin/bash
# Скрипт резервного копирования
BACKUP_DIR="/backup/milking-system"
DATE=$(date +%Y%m%d_%H%M%S)

# Создание резервной копии
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /var/www/milking-system

# Удаление старых копий (старше 30 дней)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete
```

## 🚨 Устранение неполадок

### Частые проблемы

1. **Ошибка "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Проблемы с правами доступа**
```bash
sudo chown -R $USER:$USER /var/www/milking-system
```

3. **Nginx не запускается**
```bash
sudo nginx -t  # Проверка конфигурации
sudo systemctl status nginx  # Проверка статуса
```

### Логи для диагностики

```bash
# Логи Nginx
sudo tail -f /var/log/nginx/error.log

# Логи системы
sudo journalctl -u nginx -f

# Логи приложения
tail -f /var/log/milking-system/app.log
```

## 📞 Поддержка

### Контакты технической поддержки
- Email: support@agrobot-system.com
- Телефон: +7 (XXX) XXX-XX-XX
- Документация: https://docs.agrobot-system.com

### Обновления системы

Система поддерживает автоматические обновления. Для ручного обновления:

```bash
cd /var/www/milking-system
sudo git pull origin main
sudo npm install
sudo npm run build
sudo systemctl restart nginx
```

## 📄 Лицензия

Система разработана для коммерческого использования. Все права защищены.

---

**Версия системы**: 2.4.1  
**Дата последнего обновления**: 15 января 2025  
**Совместимость**: Node.js 18+, современные браузеры
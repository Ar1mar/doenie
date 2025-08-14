# 🚀 Инструкция по развертыванию в производственной среде

## Быстрый старт для производства

### Автоматическая установка (рекомендуется)

Скачайте и запустите скрипт автоматической установки:

```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/milking-system/main/scripts/install.sh | bash
```

### Ручная установка

#### 1. Подготовка сервера

**Системные требования:**
- Ubuntu 20.04 LTS или выше / CentOS 8 или выше
- Минимум 4 ГБ RAM (рекомендуется 8 ГБ)
- 50 ГБ свободного места на диске
- Статический IP-адрес

**Обновление системы:**
```bash
sudo apt update && sudo apt upgrade -y
```

**Установка необходимых пакетов:**
```bash
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban
```

#### 2. Установка Node.js

```bash
# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка установки
node --version  # должно показать v20.x.x
npm --version   # должно показать 10.x.x
```

#### 3. Установка PM2

```bash
sudo npm install -g pm2
pm2 startup  # Следуйте инструкциям на экране
```

#### 4. Клонирование и настройка проекта

```bash
# Создание пользователя для приложения
sudo useradd -m -s /bin/bash milkingsystem
sudo usermod -aG sudo milkingsystem

# Переключение на пользователя приложения
sudo su - milkingsystem

# Клонирование проекта
git clone <your-repository-url> ~/milking-system
cd ~/milking-system

# Установка зависимостей
npm install

# Создание production сборки
npm run build
```

#### 5. Настройка переменных окружения

```bash
# Создание файла окружения
cp .env.example .env
nano .env
```

Пример конфигурации `.env`:
```env
NODE_ENV=production
VITE_APP_TITLE=AgroBot Production System
VITE_API_URL=https://your-domain.com/api
VITE_WS_URL=wss://your-domain.com/ws
VITE_ENABLE_HTTPS=true
VITE_SESSION_TIMEOUT=7200
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=warn
```

#### 6. Настройка PM2

Создайте файл конфигурации PM2:
```bash
nano ecosystem.config.js
```

Содержимое файла:
```javascript
module.exports = {
  apps: [{
    name: 'milking-system',
    script: 'npm',
    args: 'run preview',
    cwd: '/home/milkingsystem/milking-system',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/milking-system/err.log',
    out_file: '/var/log/milking-system/out.log',
    log_file: '/var/log/milking-system/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

Запуск приложения:
```bash
# Создание директории для логов
sudo mkdir -p /var/log/milking-system
sudo chown milkingsystem:milkingsystem /var/log/milking-system

# Запуск приложения
pm2 start ecosystem.config.js
pm2 save
```

#### 7. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/milking-system
```

Конфигурация Nginx:
```nginx
# Ограничение скорости запросов
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

# Upstream для приложения
upstream milking_app {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL конфигурация
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    
    # Современные SSL протоколы
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Безопасность
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Корневая директория
    root /home/milkingsystem/milking-system/dist;
    index index.html;
    
    # Основные файлы приложения
    location / {
        try_files $uri $uri/ @fallback;
        
        # Кэширование HTML файлов
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }
    }
    
    # Fallback для SPA
    location @fallback {
        rewrite ^.*$ /index.html last;
    }
    
    # API проксирование
    location /api {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://milking_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket соединения
    location /ws {
        proxy_pass http://milking_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Статические файлы с агрессивным кэшированием
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Сжатие
        gzip_static on;
    }
    
    # Логи доступа только для API
    location /api {
        access_log /var/log/nginx/milking-system-api.log;
    }
    
    # Отключение логов для статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        access_log off;
    }
    
    # Защита от ботов
    location /robots.txt {
        return 200 "User-agent: *\nDisallow: /api/\nDisallow: /admin/\n";
    }
    
    # Скрытие версии Nginx
    server_tokens off;
    
    # Максимальный размер загружаемых файлов
    client_max_body_size 10M;
    
    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;
}
```

Активация конфигурации:
```bash
# Проверка конфигурации
sudo nginx -t

# Активация сайта
sudo ln -s /etc/nginx/sites-available/milking-system /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Удаление дефолтного сайта

# Перезапуск Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### 8. Настройка SSL сертификата

```bash
# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление сертификата
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### 9. Настройка файрвола

```bash
# Базовая настройка UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Разрешение необходимых портов
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Активация файрвола
sudo ufw enable

# Проверка статуса
sudo ufw status
```

#### 10. Настройка мониторинга

**Создание скрипта мониторинга:**
```bash
sudo nano /usr/local/bin/milking-system-monitor.sh
```

Содержимое скрипта:
```bash
#!/bin/bash

# Конфигурация
APP_NAME="milking-system"
LOG_FILE="/var/log/milking-system/monitor.log"
EMAIL="admin@your-domain.com"

# Функция логирования
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Проверка PM2 процесса
check_pm2() {
    if ! pm2 list | grep -q "$APP_NAME.*online"; then
        log_message "ERROR: PM2 process $APP_NAME is not running"
        pm2 restart $APP_NAME
        log_message "INFO: Restarted PM2 process $APP_NAME"
    fi
}

# Проверка Nginx
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        log_message "ERROR: Nginx is not running"
        sudo systemctl start nginx
        log_message "INFO: Started Nginx"
    fi
}

# Проверка дискового пространства
check_disk_space() {
    USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $USAGE -gt 85 ]; then
        log_message "WARNING: Disk usage is ${USAGE}%"
        # Очистка старых логов
        find /var/log/milking-system -name "*.log" -mtime +7 -delete
    fi
}

# Проверка памяти
check_memory() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $MEMORY_USAGE -gt 90 ]; then
        log_message "WARNING: Memory usage is ${MEMORY_USAGE}%"
    fi
}

# Выполнение проверок
check_pm2
check_nginx
check_disk_space
check_memory

log_message "INFO: Health check completed"
```

Настройка автоматического запуска:
```bash
# Сделать скрипт исполняемым
sudo chmod +x /usr/local/bin/milking-system-monitor.sh

# Добавить в crontab (каждые 5 минут)
sudo crontab -e
# Добавьте строку:
*/5 * * * * /usr/local/bin/milking-system-monitor.sh
```

#### 11. Настройка резервного копирования

```bash
sudo nano /usr/local/bin/milking-system-backup.sh
```

Скрипт резервного копирования:
```bash
#!/bin/bash

# Конфигурация
BACKUP_DIR="/backup/milking-system"
APP_DIR="/home/milkingsystem/milking-system"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Создание архива
tar -czf $BACKUP_DIR/milking-system_$DATE.tar.gz \
    --exclude=node_modules \
    --exclude=dist \
    --exclude=.git \
    $APP_DIR

# Бэкап конфигурации Nginx
cp /etc/nginx/sites-available/milking-system $BACKUP_DIR/nginx_config_$DATE

# Бэкап PM2 конфигурации
cp $APP_DIR/ecosystem.config.js $BACKUP_DIR/pm2_config_$DATE.js

# Удаление старых бэкапов
find $BACKUP_DIR -name "milking-system_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "nginx_config_*" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "pm2_config_*.js" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: milking-system_$DATE.tar.gz"
```

Настройка автоматического бэкапа:
```bash
sudo chmod +x /usr/local/bin/milking-system-backup.sh

# Ежедневный бэкап в 2:00
sudo crontab -e
# Добавьте строку:
0 2 * * * /usr/local/bin/milking-system-backup.sh
```

## 🔧 Обновление системы

### Автоматическое обновление

Создайте скрипт обновления:
```bash
sudo nano /usr/local/bin/milking-system-update.sh
```

```bash
#!/bin/bash

APP_DIR="/home/milkingsystem/milking-system"
BACKUP_DIR="/backup/milking-system"

cd $APP_DIR

# Создание бэкапа перед обновлением
/usr/local/bin/milking-system-backup.sh

# Получение обновлений
git fetch origin
git pull origin main

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Перезапуск приложения
pm2 restart milking-system

echo "Update completed successfully"
```

### Ручное обновление

```bash
cd /home/milkingsystem/milking-system

# Остановка приложения
pm2 stop milking-system

# Получение обновлений
git pull origin main

# Установка зависимостей
npm install

# Сборка
npm run build

# Запуск приложения
pm2 start milking-system
```

## 📊 Мониторинг и логирование

### Настройка централизованного логирования

Установка и настройка rsyslog:
```bash
sudo nano /etc/rsyslog.d/50-milking-system.conf
```

```
# Milking System logs
if $programname == 'milking-system' then /var/log/milking-system/app.log
& stop
```

### Мониторинг с помощью Prometheus и Grafana

Установка Prometheus:
```bash
# Создание пользователя
sudo useradd --no-create-home --shell /bin/false prometheus

# Создание директорий
sudo mkdir /etc/prometheus /var/lib/prometheus
sudo chown prometheus:prometheus /etc/prometheus /var/lib/prometheus

# Скачивание Prometheus
cd /tmp
wget https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
tar xvf prometheus-2.40.0.linux-amd64.tar.gz

# Установка
sudo cp prometheus-2.40.0.linux-amd64/prometheus /usr/local/bin/
sudo cp prometheus-2.40.0.linux-amd64/promtool /usr/local/bin/
sudo chown prometheus:prometheus /usr/local/bin/prometheus /usr/local/bin/promtool
```

## 🚨 Устранение неполадок

### Частые проблемы и решения

1. **Приложение не запускается**
```bash
# Проверка логов PM2
pm2 logs milking-system

# Проверка статуса
pm2 status

# Перезапуск
pm2 restart milking-system
```

2. **Nginx возвращает 502 ошибку**
```bash
# Проверка статуса приложения
pm2 status

# Проверка логов Nginx
sudo tail -f /var/log/nginx/error.log

# Проверка конфигурации
sudo nginx -t
```

3. **SSL сертификат не работает**
```bash
# Проверка сертификата
sudo certbot certificates

# Обновление сертификата
sudo certbot renew --dry-run
```

4. **Высокое использование памяти**
```bash
# Проверка использования памяти
pm2 monit

# Перезапуск приложения
pm2 restart milking-system
```

### Команды для диагностики

```bash
# Проверка всех сервисов
sudo systemctl status nginx
pm2 status
sudo ufw status

# Проверка портов
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :80

# Проверка логов
tail -f /var/log/milking-system/combined.log
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Проверка ресурсов
htop
df -h
free -h
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи системы
2. Убедитесь, что все сервисы запущены
3. Проверьте конфигурационные файлы
4. Обратитесь к документации
5. Свяжитесь с технической поддержкой

**Контакты:**
- Email: support@agrobot-system.com
- Телефон: +7 (XXX) XXX-XX-XX
- Документация: https://docs.agrobot-system.com

---

**Важно:** Всегда создавайте резервные копии перед внесением изменений в производственную систему!
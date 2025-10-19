# Примеры использования

## Сценарий 1: Разделение рабочего и личного аккаунтов

### Проблема
У вас есть рабочий GitHub аккаунт и личный. Вам нужно часто переключаться между ними.

### Решение

```bash
# Первый запуск - создаем профили
$ sshswitch

# Выбираем "Create new profile"
# Вводим: work
# Генерируем ключ (Enter, Enter для пустого пароля)
# Активируем: Yes

# Копируем публичный ключ и добавляем в рабочий GitHub
$ cat ~/.ssh/id_rsa.pub | pbcopy

# Создаем второй профиль для личного использования
$ sshswitch
# Create new profile → personal → Generate → Activate

# Добавляем ключ в личный GitHub аккаунт
```

### Переключение

```bash
# Перед работой над рабочим проектом
$ sshswitch
# Выбираем "work" → Enter

# Перед работой над личным проектом
$ sshswitch
# Выбираем "personal" → Enter
```

## Сценарий 2: Множество клиентских проектов

### Проблема
Вы фрилансер с доступом к репозиториям разных клиентов.

### Решение

```bash
# Создаем профиль для каждого клиента
$ sshswitch
# Create new profile → client-acme
# Create new profile → client-techcorp
# Create new profile → client-startupxyz

# Структура ~/.ssh/:
# ├── client-acme/
# ├── client-techcorp/
# ├── client-startupxyz/
```

### Использование

```bash
# Работаем над проектом ACME
$ cd ~/projects/acme-app
$ sshswitch  # Выбираем client-acme
$ git pull origin main

# Переключаемся на проект TechCorp
$ cd ~/projects/techcorp-website
$ sshswitch  # Выбираем client-techcorp
$ git push origin feature/new-design
```

## Сценарий 3: Миграция существующих ключей

### Проблема
У вас уже есть SSH ключи в `~/.ssh/`, и вы хотите начать использовать профили.

### Решение

```bash
# 1. Создаем папки для существующих ключей
$ mkdir ~/.ssh/personal
$ mkdir ~/.ssh/work

# 2. Копируем существующие ключи в папки
# Для личного профиля:
$ cp ~/.ssh/id_rsa ~/.ssh/personal/id_rsa
$ cp ~/.ssh/id_rsa.pub ~/.ssh/personal/id_rsa.pub

# Для рабочего профиля (если есть другие ключи):
$ cp ~/.ssh/id_rsa_work ~/.ssh/work/id_rsa
$ cp ~/.ssh/id_rsa_work.pub ~/.ssh/work/id_rsa.pub

# 3. Запускаем sshswitch
$ sshswitch
# Теперь видим оба профиля и можем между ними переключаться
```

## Сценарий 4: Разработка на нескольких машинах

### Проблема
Вы работаете с домашнего компьютера и ноутбука, используя разные ключи.

### Решение

```bash
# На домашнем компьютере:
$ sshswitch
# Create new profile → home-desktop
# Добавляем ключ в GitHub

# На ноутбуке:
$ sshswitch
# Create new profile → laptop
# Добавляем ключ в GitHub

# Оба ключа добавлены в один GitHub аккаунт с разными именами
```

## Сценарий 5: Командная разработка с общим сервером

### Проблема
Несколько разработчиков работают на одном сервере с разными GitHub аккаунтами.

### Решение

```bash
# Разработчик 1:
$ sshswitch
# Create new profile → dev1-john
# Активирует профиль перед работой

# Разработчик 2:
$ sshswitch
# Create new profile → dev2-jane
# Активирует профиль перед работой

# Каждый работает со своим профилем
```

## Сценарий 6: Автоматизация с проверкой профиля

### Создание алиаса для проверки текущего профиля

```bash
# Добавьте в ~/.zshrc или ~/.bashrc:
alias sshprofile='cat ~/.ssh/.current_profile'

# Использование:
$ sshprofile
work

# Создание алиаса для быстрого переключения
alias sshwork='sshswitch' # и выберите work
alias sshpersonal='sshswitch' # и выберите personal
```

## Сценарий 7: Работа с несколькими организациями

### Проблема
Вы участвуете в нескольких GitHub организациях.

### Решение

```bash
$ sshswitch
# Создаем профили:
# - org-company
# - org-opensource
# - org-university

# Перед работой с каждой организацией переключаемся:
$ cd ~/projects/company-repo
$ sshswitch  # org-company
$ git pull

$ cd ~/projects/opensource-project
$ sshswitch  # org-opensource
$ git push
```

## Сценарий 8: Интеграция с Git Config

### Расширенная настройка с автоматической сменой user.name и user.email

```bash
# После переключения профиля вручную меняем git config:
$ sshswitch  # Выбираем work
$ git config --global user.name "John Doe"
$ git config --global user.email "john@company.com"

$ sshswitch  # Выбираем personal
$ git config --global user.name "John Personal"
$ git config --global user.email "john@personal.com"
```

## Полезные команды

```bash
# Проверить текущий активный профиль
$ cat ~/.ssh/.current_profile

# Посмотреть публичный ключ текущего профиля
$ cat ~/.ssh/id_rsa.pub

# Проверить подключение к GitHub
$ ssh -T git@github.com

# Посмотреть все доступные профили
$ ls -la ~/.ssh/ | grep '^d' | grep -v '^\.$\|^\.\.$'

# Скопировать публичный ключ в буфер обмена (macOS)
$ cat ~/.ssh/id_rsa.pub | pbcopy

# Скопировать публичный ключ в буфер обмена (Linux)
$ cat ~/.ssh/id_rsa.pub | xclip -selection clipboard
```

## Советы по безопасности

1. **Используйте passphrase** для важных профилей:
   ```bash
   # При создании профиля введите надежный пароль
   Enter passphrase: ********
   ```

2. **Регулярно проверяйте активные ключи** в GitHub:
   - GitHub → Settings → SSH and GPG keys
   - Удаляйте неиспользуемые ключи

3. **Используйте разные ключи** для разных целей:
   - Не используйте один ключ для личных и рабочих репозиториев

4. **Делайте backup** важных ключей:
   ```bash
   # Backup всех профилей
   $ tar -czf ssh-profiles-backup.tar.gz ~/.ssh/*/
   ```

## Troubleshooting

### Проблема: "Permission denied (publickey)"

```bash
# Убедитесь что активирован правильный профиль
$ cat ~/.ssh/.current_profile

# Проверьте права на файлы
$ chmod 600 ~/.ssh/id_rsa
$ chmod 644 ~/.ssh/id_rsa.pub

# Протестируйте подключение
$ ssh -T git@github.com
```

### Проблема: Профиль не отображается в списке

```bash
# Убедитесь что в папке профиля есть id_rsa файл
$ ls -la ~/.ssh/profile-name/

# Если файла нет, создайте профиль заново
$ sshswitch
# Create new profile → profile-name
```

### Проблема: Забыли какой профиль активен

```bash
# Проверьте содержимое файла
$ cat ~/.ssh/.current_profile

# Или запустите sshswitch и посмотрите на [+]
$ sshswitch
```


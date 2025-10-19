# Справочник команд

## Установка

| Команда | Описание |
|---------|----------|
| `./install-one-line.sh` | Быстрая установка одной командой |
| `npm install` | Установка зависимостей |
| `npm install -g .` | Глобальная установка |
| `npm link` | Создать симлинк для разработки |
| `npm unlink` | Удалить симлинк |

## Запуск

| Команда | Описание |
|---------|----------|
| `sshswitch` | Запуск скрипта (после глобальной установки) |
| `npm start` | Запуск локально |
| `node index.js` | Прямой запуск |
| `npx sshswitch` | Запуск через npx |

## NPM скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Запустить скрипт |
| `npm run install-global` | Установить глобально |
| `npm run uninstall-global` | Удалить глобальную установку |
| `npm run link` | Создать симлинк |
| `npm run unlink` | Удалить симлинк |
| `npm test` | Запустить тест (просто запускает скрипт) |

## Управление профилями

| Действие | Как выполнить |
|----------|---------------|
| Просмотреть все профили | `sshswitch` → видите список |
| Переключить профиль | `sshswitch` → выберите профиль → Enter |
| Создать новый профиль | `sshswitch` → "Create new profile" |
| Узнать текущий профиль | `cat ~/.ssh/.current_profile` |
| Посмотреть публичный ключ | `cat ~/.ssh/id_rsa.pub` |

## Полезные команды

| Команда | Описание |
|---------|----------|
| `cat ~/.ssh/.current_profile` | Показать текущий профиль |
| `cat ~/.ssh/id_rsa.pub` | Показать текущий публичный ключ |
| `cat ~/.ssh/id_rsa.pub \| pbcopy` | Скопировать ключ (macOS) |
| `cat ~/.ssh/id_rsa.pub \| xclip -selection clipboard` | Скопировать ключ (Linux) |
| `ssh -T git@github.com` | Проверить подключение к GitHub |
| `ls -la ~/.ssh/` | Посмотреть все файлы SSH |
| `chmod 600 ~/.ssh/id_rsa` | Исправить права приватного ключа |
| `chmod 644 ~/.ssh/id_rsa.pub` | Исправить права публичного ключа |

## Ручное управление

| Действие | Команда |
|----------|---------|
| Создать папку профиля | `mkdir ~/.ssh/profile-name` |
| Сгенерировать ключ вручную | `ssh-keygen -t rsa -b 4096 -f ~/.ssh/profile-name/id_rsa -C "name@github.com"` |
| Скопировать ключ в профиль | `cp ~/.ssh/id_rsa ~/.ssh/profile-name/` |
| Backup профилей | `tar -czf ssh-backup.tar.gz ~/.ssh/*/` |
| Восстановить backup | `tar -xzf ssh-backup.tar.gz -C ~/` |

## Git команды

| Команда | Описание |
|---------|----------|
| `git config --global user.name "Name"` | Установить имя пользователя |
| `git config --global user.email "email@example.com"` | Установить email |
| `git config --global --list` | Показать текущую конфигурацию |
| `git remote -v` | Показать удаленные репозитории |

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Command not found: sshswitch | Переустановите: `npm install -g .` |
| Permission denied | Проверьте права: `chmod 600 ~/.ssh/id_rsa` |
| Профиль не отображается | Убедитесь что есть `id_rsa` в папке профиля |
| Git использует старый ключ | Проверьте `cat ~/.ssh/.current_profile` и переключите профиль |
| Нет доступа к GitHub | Проверьте: `ssh -T git@github.com` |

## Структура директорий

```
~/.ssh/
├── profile1/
│   ├── id_rsa
│   └── id_rsa.pub
├── profile2/
│   ├── id_rsa
│   └── id_rsa.pub
├── id_rsa              # Текущий активный
├── id_rsa.pub          # Текущий активный
├── .current_profile    # Имя текущего профиля
└── known_hosts         # Известные хосты
```

## Быстрые действия

### Создать и активировать новый профиль за 30 секунд

```bash
sshswitch
# → Create new profile
# → Введите имя (например: work)
# → Enter, Enter (пустой пароль)
# → Yes (активировать)
# → Скопируйте ключ: cat ~/.ssh/id_rsa.pub | pbcopy
# → Добавьте в GitHub Settings → SSH keys
```

### Переключиться между профилями за 5 секунд

```bash
sshswitch
# → Выберите профиль стрелками
# → Enter
# → Готово!
```

### Проверить что всё работает

```bash
# 1. Проверить текущий профиль
cat ~/.ssh/.current_profile

# 2. Проверить подключение
ssh -T git@github.com

# 3. Сделать тестовый git pull
cd your-repo
git pull
```


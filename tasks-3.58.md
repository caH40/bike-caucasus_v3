# Планирование разработки проекта

v3.58.1 +инициализация;  
v3.58.2 +верстка формы и полей ввода информации по возрастным категориям;  
v3.58.3 +сервис добавления возрастных категорий при создании чемпионата;  
v3.58.4 +устранён баг при отображении зарегистрированных райдеров в чемпионате;  
v3.58.5 +исправление багов при создании/редактировании категорий;  
v3.58.6 +исправления бага с отображением подсказки на иконках pdf;  
v3.58.7 +блокировка регистрации, если соревнование завершено или отменено;  
v3.58.8 +запрет удаления Чемпионата который завершился;  
v3.58.9 +запрет на редактирование Чемпионата который завершился;  
v3.58.10 +удаление документов с регистрации на чемпионат при удалении чемпионата;  
v3.58.11 +увеличен диапазон стартовых номеров до 100шт;  
v3.58.12 +выделение блока подсветкой в котором активный input;  
v3.59.1 +улучшение логики проверки разрешений для модерации новости;  
v3.59.2 +проверка разрешений на динамических страницах с urlSlug;  
v3.59.3 +перенесены серверные экшены из компонентов страниц новостей в отдельный модуль
новостных экшенов;  
v3.59.4 +проверка разрешений у пользователя на обновления новости при отправке отредактированной
новости на сервер;  
v3.59.5 +перенесён экшен создания маршрута из компонента страницы в модуль экшенов работы с
маршрутами;  
v3.59.6 +создан класс проверки разрешений и проверки авторства модерируемой сущности. Проверка
этим методом экшена на модерацию маршрута;  
v3.59.7 +изменение метода обновления данных маршрута, перенесена логика проверки разрешений в
отдельный класс, вызываемый в серверном экшене;  
v3.59.8 +удален метод проверки разрешения из класса news и заменен на метод из класса
permission;  
v3.59.9 +изменение и добавление стандартных разрешений для страниц чемпионата;  
v3.59.10 +добавлены модераторы для организатора чемпионата, для модерации чемпионатов;  
v3.59.11 +проверка разрешений для редактирования чемпионата перед открытием формы
редактирования;  
v3.59.12 +проверка разрешений перед удалением чемпионата;  
v3.59.13 +оптимизация классов Permissions;  
v3.59.14 +проверка разрешений для редактирования чемпионата через метод класса permissions;  
v3.59.15 +проверка разрешений для редактирования протокола и результата в протоколе;  
v3.60.1 +создание новой роли. Страница и бэкенд для создания новой роли;  
v3.60.2 +исправлены линки на страницы модерации Разрешений;  
v3.60.3 +создан экшен и метод получения всех Ролей на сайте;  
v3.60.4 +удаление роли;  
v3.60.5 +страница редактирования роли;  
v3.60.6 +динамическая ревалидация страниц работы с доступом;  
v3.60.7 +страница логов ошибок сделана динамической;  
v3.60.8 +удаление Разрешения из всех массива разрешений в Роли при удалении Разрешения;  
v3.60.9 +замена удаляемой роли на роль user у пользователей у которых была удаляемая роль;  
v3.60.10 +исправление мелкого бага;  
v3.60.11 +исправление названий кнопки с Добавить на Создать. Запрет изменения названия
Разрешения;  
v3.61.1 +форма для модерации Пользователя администратором;  
v3.61.2 +экшен и метод для сохранения измененных данных Пользователя администратором;  
v3.61.3 +исправлены баги при отображении страницы Организатора;  
v3.61.4 +спинер загрузки перенесен в body. Отображение спинера загрузки при аутентификации;  
v3.61.5 +исправлен баг с задним фоном для событий в календаре;  
v3.61.6 +исправлен баг с разрешениями для Организатора;  
v3.61.7 +подсвечивание строк в таблице при наведении курсором в таблице ролей и разрешений;  
v3.61.8 +исправлен баг при отображении имени и фамилии автора публикации;  
v3.61.9 +добавление даты чемпионата в pdf файлы стартового протокола;  
v3.62.1 +страница документов чемпионата и базовая разметка;  
v3.62.2 +пункт в меню для страницы документов чемпионата;  
v3.62.3 +перенесены иконки скачивания таблицы зарегистрированных участников на страницу
Документы;  
v3.62.4 +добавлена иконка Документы;  
v3.62.5 +функциональность формирования pdf файлов итоговых протоколов заезда;  
v3.62.6 +в заголовок страницы документы добавлено название чемпионата;  
v3.62.7 +убрано сообщение в консоль;  
v3.62.8 +исправление бага отображения соответствующих отставаний для категорий в протоколах в
файлах pdf;  
v3.62.9 +добавлен рекомендательный виджет от РСЯ на главную страницу;  
v3.62.10 +небольшие правки;  
v3.62.11 +небольшие правки;  
v3.62.12 +небольшие правки;  
v3.62.13 +удалён рекомендательный виджет от РСЯ на главную страницу;  
v3.62.14 +добавлен рекомендательный виджет от РСЯ на главную страницу;  
v3.62.15 +добавлен рекомендательный виджет от РСЯ на страницу webcam;  
v3.62.16 +небольшие правки;  
v3.62.17 +добавлен рекомендательный виджет от РСЯ на страницу trails;  
v3.62.18 +добавлены рекомендательные виджеты от РСЯ на страницы Championships, Organizers,
Calendar;  
v3.62.19 +для пункта меню Чемпионаты добавлена эмодзи, обозначающая наличие попап меню у данного
пункта; v3.63.1 +убран сервис google для авторизации и регистрации;

-при удалении результата райдера не обновляется протокол.  
-Изменить логику удаления старого постера при редактировании новости.  
-при удалении удалять все комментарии к новости из БД.  
-при добавлении результата в заезде, проверять на наличие результата у данного райдера в других
заездах этого Соревнования в этот день.  
-оптимизировать компонент boxSelect, используется только для gender;  
-в Race добавить количество стартовых номеров (диапазон);  
-проверить регистрацию через vk, выводить причину неудачной регистрации;  
-добавить город в объект Чемпионата;  
-создано несколько функций createOptions для формирования опций селекта, объединить в одну!  
-сделать фон в блоках на странице создании чемпионатов соответствующий выбранному типу
велосипеда.  
-таблицу распределения очков в Серии создает админ.  
-в форму Чемпионата добавить инпут, для отметки обязательных этапов в серии для квалификации в
серии.  
-в экшене обновления данных чемпионата не делается проверка на принадлежность обновляемого
Чемпионата пользователю, который вносит изменения.  
-валидацию инпута для файла и изображения во всех формах, есть только для Чемпионата.  
-важную новость убирать, если дата события прошла;  
 -убрать margin-bottom у TitleAndLine, марджин устанавливать для следующих блоков;  
 -в форме регистрации в инпуте для email стоит type="text";  
 -добавить попап к маркерам и сделать кластер для маркеров https://www.youtube.com/watch?v=jD6813wGdBA&t=427s;
-необходимо более информативно сообщать об ошибках при заполнении форм-;  
 -в формирование новости добавить ссылку на первоисточник;  
 -при полном удалении новостного блока не удаляется изображение (если оно было) с облака, так как
нигде не сохраняется информация об этом;  
 -вынести время разрешенного редактирования в настройки сайта, изменяемые админом. На данный
момент это захардкожено;  
 -выставление размера загружаемого файла на облако в одном месте, сейчас в Cloud и в форме;  
 -в сообщение ошибки добавлять уникальный ключ, что бы в дальнейшем можно производить фильтрацию
и игнорирование для логирования;  
 -в настройках аккаунта пользователя добавить возможность исключить его индексацию в поисковых системах;

-хэндлер обработки ошибок для функций в серверном компонентах;  
 -делать проверку вводимых данных на длинные слова, которые ломают верстку из-за того, что не переносятся
на другую строку;  
 -при выходе делать редирект на главную страницу;  
 -как обрабатывать ошибку в компоненте Image, если src существует, но по ссылке нет изображения;

-сохранение ошибок при регистрации через providers;  
 -при регистрации пользователя создавать папку, где будут храниться картинки пользователя /public/profiles/user_1/avatar.jpg

-если не найден пользователь в БД то обнулять сессию;  
 -разобраться с типизацией mongoose, при model.create({}) не контролируются входные свойства

=================================================================================================
Да, хранение только имени файла в базе данных и динамическое добавление bucketname и endpoint
при запросе URL может быть хорошим подходом для решения проблемы с доступностью endpoint. Этот
метод позволит вам легко изменять endpoint или другие части URL, если это потребуется, без
необходимости обновлять все записи в базе данных. Вот как вы можете реализовать это:

Хранение данных в базе данных: Сохраняйте в базе данных только название файла, например,
filename.jpg. Это позволяет вам избежать проблем с изменениями в endpoint или других частях URL.

Формирование URL при запросе:

Серверный код: В вашем приложении или серверной части кода добавляйте bucketname и endpoint к
имени файла для создания полного URL. Например, если у вас есть переменные bucketName и
endpoint, вы можете сформировать URL следующим образом:

base_url = f"https://{bucketName}.{endpoint}/"  
file_name = "filename.jpg" #Полученное из базы данных  
full_url = f"{base_url}{file_name}"

Конфигурационные файлы: Рассмотрите возможность хранения bucketname и endpoint в
конфигурационном файле или переменных окружения, чтобы их можно было легко изменять без
необходимости пересборки кода.

Обработка ошибок: Добавьте логику для обработки случаев, когда endpoint недоступен. Например,
если один endpoint недоступен, вы можете попробовать другой.

Информационная поддержка: Если вы используете несколько endpoint и хотите иметь возможность
переключаться между ними, убедитесь, что у вас есть план для управления этим переключением,
возможно, с помощью дополнительных метаданных или конфигурационных данных.

Этот подход не только делает вашу систему более гибкой, но и упрощает управление изменениями и
масштабирование, если вам потребуется добавить дополнительные endpoint или изменить текущий.
=================================================================================================

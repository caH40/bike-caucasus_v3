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
пункта;  
v3.63.1 +убран сервис google для авторизации и регистрации;  
v3.4.1 +обновлен nextjs до версии 15.3;  
v3.4.2 +next/codemod;  
v3.4.3 +next/codemod2;  
v3.4.4 +исправлены все предупреждения от codemod;  
v3.4.5 +исправление типизации запросов mongoose из mongodb;  
v3.4.6 +исправление бага из-за неподдерживаемой опции ssr:false в серверном компоненте в
next15;  
v3.4.7 +исключена яндекс метрика и рся в режиме разработки;  
v3.4.8 +оптимизация компонента формы для создания/редактирования чемпионата;  
v3.4.9 +исправлены баги при отображении набора высоты в описании заезда соревнования;  
v3.4.10 +оптимизация компонента формы для создания/редактирования чемпионата;  
v3.4.11 +приватные методы обработки races при создании или редактировании Чемпионата в
сервисе;  
v3.4.12 +установка шага итерации в 1 для количества этапов и количества кругов;  
v3.4.13 +ограничение даты старта и финиша для этапов серии заездов при их создании;  
v3.4.14 +мелкие правки;  
v3.4.15 +категории в чемпионате перенесены из сущности заезда в сущность чемпионата;  
v3.4.16 +категории вынесены в отдельную коллекцию БД; v3.4.17 +категории вынесены в отдельную
коллекцию БД;  
v3.4.17 +внесены правки в класс управления финишным протоколом из-за новой структуры
категорий;  
v3.4.18 +документация по установке категорий;  
v3.4.19 +добавлен метод обновления пакетов категорий в чемпионате;  
v3.4.20 +исправлены мелкие баги;  
v3.4.21 +добавлен экшен обновления категорий;  
v3.4.22 +в сущность чемпионата добавлен массив конфигураций категорий;  
v3.4.23 +навигационные кнопки переключения между формами редактирования чемпионата;  
v3.4.24 +контроль несохраненных данных при закрытии формы;  
v3.4.25 +создание и сохранение основных настроек чемпионата;  
v3.4.26 +правки в функциональности сохранении изменений главных настроек чемпионата;  
v3.4.27 +добавление стандартного пакета категорий при создании чемпионата;  
v3.4.28 +добавление контейнера для блоков с полями ввода данных категорий чемпионата;  
v3.4.29 +функциональность добавления возрастных категорий;  
v3.4.30 +функциональность добавления категорий по уровню подготовки;  
v3.4.31 +сериализации отправляемых данных по категориям. Серверный экшен для отправки данных;  
v3.4.32 +десериализация получаемых измененных данных по категориям на сервере;  
v3.4.33 +исправлен баг обновления массива id категорий при обновлении категорий чемпионата;  
v3.4.34 +обновление данных формы при ответе сервера после отправки новых данных;  
v3.4.35 +исправлены мелкие баги;  
v3.4.36 +базовая форма добавления заезда в чемпионат;  
v3.4.37 +исправлен баг с TRaceForForm;  
v3.4.38 +сериализация данных формы заездов;  
v3.4.39 +десериализация данных формы заездов;  
v3.4.40 +сохранение обновлённых заездов в БД;  
v3.4.41 +исправлены баги при сохранении обновлённых заездов в БД;  
v3.4.42 +мелки правки стилей в формах редактирования чемпионата;  
v3.4.43 +исправления бага получения дынных чемпионата из-за создания отдельной коллекции race;  
v3.4.44 +перенесены методы работы с сущностью категории чемпионата в отдельный класс;  
v3.4.45 +перенесены методы работы с сущностью заезды чемпионата в отдельный класс;  
v3.65.1 +обновление метода регистрации участника в чемпионат из-за изменившейся структур схем
чемпионата и заездов;  
v3.65.2 +обновление метода проверки регистрации участника в чемпионате;  
v3.65.3 +обновление метода получения зарегистрированных райдеров в заезде;  
v3.65.4 +обновление метода аннулирования регистрации в заезде;  
v3.65.5 +обновление метода получения всех заездов в который зарегистрирован пользователь;  
v3.65.6 +обновление метода получения всех результатов;  
v3.65.7 +исправлены мелкие баги;  
v3.65.8 +исправлен баг получения стартовых номеров;  
v3.65.9 +обновление метода сохранения результата райдера в заезде;  
v3.65.10 +обновление метода редактирования результата райдера в заезде;  
v3.65.11 +исправлены ошибки типизации при билдинге приложения;  
v3.65.12 +исправлен баг с метаданными трека;  
v3.65.13 +замена удаленного \_id конфигурации категорий в заездах чемпионата на стандартную
конфигурацию категорий;  
v3.65.14 +исправлен баг при удалении категории skillLevel;  
v3.65.15 +обновлен метод удаления чемпионата с учетом новых сущностей: заезд, категории;  
v3.65.16 +исправлены баги после обновления библиотеки jsPDF при формировании pdf файлов;  
v3.65.17 +мелкие правки по css;  
v3.66.1 +добавлена политика конфиденциальности и пользовательское соглашение;  
v3.66.2 +добавлена политика конфиденциальности и пользовательское соглашение в подвал сайта;  
v3.66.3 +добавлена политика конфиденциальности и пользовательское соглашение в меню
аутентификации;  
v3.66.4 +добавлен выбор флаг отображения отчества при отображении полного имени на сайте;  
v3.66.5 +добавлен функционал выбор отображения полного имени на странице профиля;  
v3.66.10 +увеличено максимальное количество символов в названии чемпионата до 100;  
v3.66.11 +исправлен баг при обновлении списка заездов в чемпионате;  
v3.66.12 +исправлен баг при добавлении незарегистрированного участник на сайте;  
v3.66.13 +создание preferences с начальными значениями в документе User при регистрации
пользователя;  
v3.66.14 +изменен почтовый ящик для отправки email пользователям;  
v3.66.15 +изменена логика формирования sitemap для страниц чемпионата;  
v3.67.1 +запуск подключения к БД сделан из одного места в приложении - из rootLayout;  
v3.67.2 +добавлена возможность скачивания трека заезда в чемпионате;  
v3.67.3 +отображение полного имени в таблицах результата и регистрации;  
v3.67.4 +фон стартового номера для женщин отличается от мужских стартовых номеров;  
v3.67.5 +исправлен баг при проверки на дублирование стартовых номеров в финишном протоколе
заезда;  
v3.67.6 +переименование ResponseServer в ServerResponse;  
v3.67.7 +исправлены мелкие баги в чемпионате типа series;  
v3.67.8 +создание urlSlug для этапа на основе родительского urlSlug. Добавление
categoriesConfigs в этап из родительского чемпионата;  
v3.67.9 +добавлен столбец "серия заездов" в таблице всех чемпионатов для модерации;  
v3.67.10 +исправлен баг при попытке регистрации в заезде, когда отсутствуют заезды;  
v3.67.11 +отображения пункта меню: редактирование финишных протоколов в зависимости от типа
чемпионата;  
v3.67.12 +удаление всех связанных сущностей Серии(тура) при удалении Серии(тура);  
v3.68.1 +добавлен тип, схема и модель для таблицы начисления очков в серии заездов;  
v3.68.2 +страница модерации таблиц начисления очков в серии заездов;  
v3.68.3 +класс работы с сущностью: таблицы начисления очков за заезд в серии заездов;  
v3.68.4 +метод получения таблицы начисления очков за заезд в серии заездов;  
v3.68.5 +реализация методов и экшенов получения таблиц и таблицы начисления очков за заезд в
серии заездов;  
v3.68.6 +реализация методов и экшенов создания, обновления, удаления таблиц начисления очков за
заезд в серии заездов;  
v3.68.7 +таблица с отображением всх таблиц с начисляемыми очками за места на этапах серии
заездов;  
v3.68.8 +реализация удаления с клиента очковой таблицы;  
v3.68.9 +отображение таблицы очков, обработчики нажатий на просмотр и редактирование таблицы
очков;  
v3.68.10 +исправлены баги с доступом к странице модерации очковой таблицы;  
v3.68.11 +формы заполнения очковой таблицы;  
v3.68.12 +отправка и сохранение формы заполнения очковой таблицы;  
v3.68.13 +отправка и сохранение отредактированной формы заполнения очковой таблицы;  
v3.68.14 +исправлены мелкие баги;  
v3.68.15 +изменена логика аутентификации, нет проверки на дубли email, email необязателен при
регистрации;  
v3.68.16 +исправлен баг с таблицей зарегистрированных пользователей;  
v3.68.17 +выбор категории при регистрации;  
v3.68.18 +отображение категории в таблице зарегистрированных участников в заезде;  
v3.68.19 +при отсутствии необходимого возрастного диапазона категории назначается "нет
категории";  
v3.68.20 +очистка текста описания организатора от html тэгов. Отображение описания с
соответствующими переносами;  
v3.68.21 +исправлен баг при отображении заездов в которых зарегистрирован пользователь в
профиле;  
v3.68.22 +изменен формат отображаемых дат;  
v3.68.23 +исправлен баг при отображении попап меню модерации финишного протокола;  
v3.68.24 +исправлен баг при выборе чемпионата для модерации финишного протокола;  
v3.68.25 +выбор категории skillLevel при создании финишного протокола;  
v3.68.26 +выбор категории skillLevel при изменении финишного результата;

-добавить выбор categorySkill при формировании/редактирования финишного протокола;  
-сделать процедуру обнуления соответствующего categorySkill у зарегистрированных участников при
удалении этого categorySkillLevel из настроек чемпионата(заезда);  
-в этап серии добавить пункт меню возвращения в родительский чемпионат;  
-перенести putAccount из компонента страницы в файл экшенов;  
-в управлении в меню Редактирования сделать дополнительный список сущностей, которые можно
редактировать. Дополнительно к меню Список;  
-заменить во всех фильтрах (навигационных кнопка) функцию получения позиции в каждом модуле на
внешнюю утилиту getPosition;  
-изменить структуру кнопок на { id: 'overall', title: 'Общие', // "translation" заменён на более
универсальное "title" icon: '⚙️', // Добавлена иконка для визуального различия order: 0 // Явное
указание порядка вместо использования индекса массива }  
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

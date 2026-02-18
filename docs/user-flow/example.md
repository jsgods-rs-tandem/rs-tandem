```mermaid
graph TD
    %% Nodes
    Landing[Landing page]
    Auth{Авторизован}
    Login[Login/register]
    Dashboard[Dashboard]
    Profile[Profile]
    Library[Library<br/>темы+поиск+фильтры]
    AIChat[AI chat]
    Quiz[Quiz widget]
    DnD[Drag and Drop widget]
    Answer([Ответ])
    Validation([Валидация])
    Correct{Верно?}
    Report[Report page]

    %% Connections
    Landing --> Auth
    
    Auth -- Нет --> Login
    Auth -- Да --> Dashboard
    
    Login --> Auth
    
    Dashboard -- Logout --> Login
    Dashboard --> Profile
    Dashboard --> Library
    Dashboard --> AIChat

    Library --> Quiz
    Library --> DnD

    AIChat -.-> Quiz
    AIChat -.-> DnD
    AIChat -.-> Report

    Quiz --> Answer
    DnD --> Answer
    
    Answer --> Validation
    Validation --> Correct
    
    Correct -- Нет --> Quiz
    Correct -- Нет --> DnD
    Correct -- Да --> Report
    
    Report --> Library
```
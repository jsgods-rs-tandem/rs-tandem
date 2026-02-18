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
    QuizAnswer([Ответ])
    QuizValidation([Валидация])
    QuizCorrect{Верно?}
    QuizReport[Report page]
    DnDAnswer([Ответ])
    DnDValidation([Валидация])
    DnDCorrect{Верно?}
    DnDReport[Report page]

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
    AIChat -.-> DnDReport
    AIChat -.-> QuizReport

    Quiz --> QuizAnswer

    QuizAnswer --> QuizValidation
    QuizValidation --> QuizCorrect

    QuizCorrect -- No --> Quiz
    QuizCorrect -- Yes --> QuizReport
    QuizReport --> Library

    DnD --> DnDAnswer

    DnDAnswer --> DnDValidation

    DnDValidation --> DnDCorrect

    DnDCorrect -- Нет --> DnD
    DnDCorrect -- Да --> DnDReport

    DnDReport --> Library
```
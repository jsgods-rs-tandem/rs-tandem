
``` mermaid
graph TD
    subgraph LandingGroup [Landing Component]
    Landing[Landing page]
    end

    subgraph DashboardGroup [Dashboard Component]
    Dashboard[Dashboard]
    end

    subgraph AuthGroup [Authorization Component]
        Auth{Is authorized?}
        Login[Login/register]
    end

    subgraph ProfileGroup [Profile Component]
        Profile[Profile]
    end

    subgraph AIChatGroup [AI Assistant Component]
        AIChat[AI chat]
    end

    subgraph LibraryGroup [Library Component]
        Library[Library<br/>themes+searching+filters]
    end

    subgraph QuizModule [Quiz Component]
        Quiz[Quiz widget]
        QuizAnswer([Answer])
        QuizValidation([Validation])
        QuizCorrect{Is correct?}
        QuizReport[Report page]
        QuizIsLast{Is last?}
    end

    subgraph DnDModule [Drag and Drop Component]
        DnD[Drag and Drop widget]
        DnDAnswer([Answer])
        DnDValidation([Validation])
        DnDCorrect{Is correct?}
        DnDReport[Report page]
        DnDIsLast{Is last?}
    end

    %% Основные связи
    Landing --> Auth
    Auth -- No --> Login
    Auth -- Yes --> Dashboard
    Login --> Auth
    
    Dashboard -- Logout --> Login
    Dashboard --> Profile
    Dashboard --> Library
    Dashboard --> AIChat

    %% Связи внутри и между модулями
    Library --> Quiz
    Library --> DnD

    AIChat -.-> Quiz
    AIChat -.-> DnD
    AIChat -.-> DnDReport
    AIChat -.-> QuizReport

    %% Quiz
    Quiz --> QuizAnswer
    QuizAnswer --> QuizValidation
    QuizValidation --> QuizCorrect
    QuizCorrect -- No --> Quiz
    QuizCorrect -- Yes --> QuizReport
    QuizReport --> QuizIsLast
    QuizIsLast -- Yes --> Library
    QuizIsLast -- No --> Quiz

    %% DnD
    DnD --> DnDAnswer
    DnDAnswer --> DnDValidation
    DnDValidation --> DnDCorrect
    DnDCorrect -- No --> DnD
    DnDCorrect -- Yes --> DnDReport
    DnDReport --> DnDIsLast
    DnDIsLast -- Yes --> Library
    DnDIsLast -- No --> DnD
```
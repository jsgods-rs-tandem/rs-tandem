```mermaid
graph TD
    %% Nodes
    Landing[Landing page]
    Auth{Is authorized?}
    Login[Login/register]
    Dashboard[Dashboard]
    Profile[Profile]
    Library[Library<br/>themes+searching+filters]
    AIChat[AI chat]
    Quiz[Quiz widget]
    DnD[Drag and Drop widget]
    QuizAnswer([Answer])
    QuizValidation([Validation])
    QuizCorrect{Is correct?}
    QuizReport[Report page]
    QuizIsLast{Is last?}
    DnDAnswer([Answer])
    DnDValidation([Validation])
    DnDCorrect{Is correct?}
    DnDReport[Report page]
    DnDIsLast{Is last?}

    %% Connections
    Landing --> Auth
    
    Auth -- No --> Login
    Auth -- Yes --> Dashboard
    
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

    QuizReport --> QuizIsLast

    QuizIsLast -- Yes --> Library
    QuizIsLast -- No --> Quiz

    DnD --> DnDAnswer

    DnDAnswer --> DnDValidation

    DnDValidation --> DnDCorrect

    DnDCorrect -- No --> DnD
    DnDCorrect -- Yes --> DnDReport

    DnDReport --> Library
    DnDReport --> DnDIsLast

    DnDIsLast -- Yes --> Library
    DnDIsLast -- No --> DnD
```
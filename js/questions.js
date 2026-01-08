// WWM Battle Royale - Fragendatenbank

// Original questions pool
const QUESTIONS_POOL = [
    // Multiple Choice Fragen
    {
        type: 'multiple',
        question: 'Welches ist das größte Säugetier der Welt?',
        answers: ['Elefant', 'Blauwal', 'Giraffe', 'Hai'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'In welchem Jahr fiel die Berliner Mauer?',
        answers: ['1987', '1989', '1991', '1985'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welche Programmiersprache wird hauptsächlich für Webseiten verwendet?',
        answers: ['Python', 'JavaScript', 'C++', 'Ruby'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Herzen hat ein Oktopus?',
        answers: ['1', '2', '3', '4'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welcher Planet ist der Sonne am nächsten?',
        answers: ['Venus', 'Mars', 'Merkur', 'Erde'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches ist das schnellste Landtier?',
        answers: ['Gepard', 'Löwe', 'Antilope', 'Strauß'],
        correct: 0
    },
    {
        type: 'multiple',
        question: 'Wie viele Spieler hat ein Fußballteam auf dem Feld?',
        answers: ['9', '10', '11', '12'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welche Farbe hat ein Smaragd?',
        answers: ['Rot', 'Blau', 'Grün', 'Gelb'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'In welchem Land befindet sich der Eiffelturm?',
        answers: ['Italien', 'Spanien', 'Frankreich', 'Deutschland'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Wie viele Kontinente gibt es?',
        answers: ['5', '6', '7', '8'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches ist das kleinste Land der Welt?',
        answers: ['Monaco', 'Vatikanstadt', 'San Marino', 'Liechtenstein'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie heißt der längste Fluss der Welt?',
        answers: ['Nil', 'Amazonas', 'Jangtse', 'Mississippi'],
        correct: 0
    },
    {
        type: 'multiple',
        question: 'Welches Gas atmen Menschen hauptsächlich ein?',
        answers: ['Sauerstoff', 'Stickstoff', 'Kohlendioxid', 'Helium'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Zähne hat ein erwachsener Mensch normalerweise?',
        answers: ['28', '30', '32', '34'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches ist das meistgesprochene Sprache der Welt?',
        answers: ['Englisch', 'Spanisch', 'Mandarin', 'Hindi'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'In welchem Jahr landeten Menschen zum ersten Mal auf dem Mond?',
        answers: ['1967', '1969', '1971', '1973'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welches Tier ist das Symbol von WWF?',
        answers: ['Tiger', 'Panda', 'Elefant', 'Eisbär'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Sekunden hat eine Stunde?',
        answers: ['3000', '3600', '4000', '4200'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welches ist das größte Organ des menschlichen Körpers?',
        answers: ['Herz', 'Lunge', 'Leber', 'Haut'],
        correct: 3
    },
    {
        type: 'multiple',
        question: 'In welcher Stadt steht die Freiheitsstatue?',
        answers: ['Los Angeles', 'New York', 'Miami', 'Chicago'],
        correct: 1
    },
    
    // Sortier-Fragen
    {
        type: 'sort',
        question: 'Ordne diese Planeten nach ihrer Entfernung von der Sonne (nah → fern):',
        answers: ['Merkur', 'Venus', 'Erde', 'Mars'],
        correct: ['Merkur', 'Venus', 'Erde', 'Mars']
    },
    {
        type: 'sort',
        question: 'Ordne diese Ereignisse chronologisch (alt → neu):',
        answers: ['Entdeckung Amerikas', 'Französische Revolution', 'Erster Weltkrieg', 'Fall der Berliner Mauer'],
        correct: ['Entdeckung Amerikas', 'Französische Revolution', 'Erster Weltkrieg', 'Fall der Berliner Mauer']
    },
    {
        type: 'sort',
        question: 'Ordne diese Tiere nach ihrer Größe (klein → groß):',
        answers: ['Maus', 'Katze', 'Pferd', 'Elefant'],
        correct: ['Maus', 'Katze', 'Pferd', 'Elefant']
    },
    {
        type: 'sort',
        question: 'Ordne diese Zahlen aufsteigend:',
        answers: ['42', '17', '99', '5'],
        correct: ['5', '17', '42', '99']
    },
    {
        type: 'sort',
        question: 'Ordne diese Monate nach ihrer Reihenfolge im Jahr:',
        answers: ['März', 'Juni', 'September', 'Dezember'],
        correct: ['März', 'Juni', 'September', 'Dezember']
    }
];

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle questions on load
const QUESTIONS = shuffleArray(QUESTIONS_POOL);

console.log('📝 Fragen wurden gemischt! Erste Frage:', QUESTIONS[0].question);
console.log('📊 Gesamt Fragen:', QUESTIONS.length);
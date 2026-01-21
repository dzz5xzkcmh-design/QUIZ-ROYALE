// Quiz Royale - Fragendatenbank (NUR Multiple Choice!)

// Fisher-Yates Shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Original questions pool - NUR MULTIPLE CHOICE!
const QUESTIONS_POOL = [
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
        answers: ['Venus', 'Merkur', 'Mars', 'Erde'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Beine hat eine Spinne?',
        answers: ['6', '8', '10', '12'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welches ist das kleinste Land der Welt?',
        answers: ['Monaco', 'Vatikanstadt', 'San Marino', 'Liechtenstein'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'In welchem Land befindet sich die Chinesische Mauer?',
        answers: ['Japan', 'China', 'Korea', 'Mongolei'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welcher Ozean ist der größte?',
        answers: ['Atlantik', 'Indischer Ozean', 'Pazifik', 'Arktischer Ozean'],
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
        question: 'Welche Farbe hat ein Smaragd?',
        answers: ['Rot', 'Blau', 'Grün', 'Gelb'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Wer malte die Mona Lisa?',
        answers: ['Pablo Picasso', 'Leonardo da Vinci', 'Vincent van Gogh', 'Michelangelo'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welches ist das schnellste Landtier?',
        answers: ['Löwe', 'Gepard', 'Antilope', 'Pferd'],
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
        question: 'Welches ist die Hauptstadt von Frankreich?',
        answers: ['London', 'Berlin', 'Paris', 'Rom'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches Element hat das chemische Symbol "O"?',
        answers: ['Gold', 'Sauerstoff', 'Osmium', 'Ozon'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?',
        answers: ['9', '10', '11', '12'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welcher ist der längste Fluss der Welt?',
        answers: ['Amazonas', 'Nil', 'Jangtse', 'Mississippi'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'In welchem Jahr endete der Zweite Weltkrieg?',
        answers: ['1943', '1944', '1945', '1946'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Wie heißt die Hauptstadt von Japan?',
        answers: ['Peking', 'Seoul', 'Tokio', 'Bangkok'],
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
    {
        type: 'multiple',
        question: 'Wie viele Knochen hat ein erwachsener Mensch?',
        answers: ['186', '206', '226', '246'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welche Farbe erhält man wenn man Gelb und Blau mischt?',
        answers: ['Orange', 'Grün', 'Violett', 'Braun'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'In welchem Land wurde Pizza erfunden?',
        answers: ['Spanien', 'Griechenland', 'Italien', 'Frankreich'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Wie heißt die Hauptstadt von Australien?',
        answers: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welcher Planet ist als "Roter Planet" bekannt?',
        answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Saiten hat eine Standard-Gitarre?',
        answers: ['4', '5', '6', '7'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches Element hat das chemische Symbol "Au"?',
        answers: ['Silber', 'Gold', 'Aluminium', 'Kupfer'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'In welchem Jahr begann der Zweite Weltkrieg?',
        answers: ['1937', '1939', '1941', '1943'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Olympische Ringe gibt es?',
        answers: ['3', '4', '5', '6'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welches ist das schnellste Tier im Wasser?',
        answers: ['Hai', 'Delfin', 'Schwertfisch', 'Thunfisch'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Wie heißt der höchste Berg der Erde?',
        answers: ['K2', 'Mount Everest', 'Kilimandscharo', 'Mont Blanc'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Welches Tier kann sein Gehirn regenerieren?',
        answers: ['Delfin', 'Krake', 'Elefant', 'Rabe'],
        correct: 1
    },
    {
        type: 'multiple',
        question: 'Wie viele Minuten hat ein Tag?',
        answers: ['1200', '1380', '1440', '1500'],
        correct: 2
    },
    {
        type: 'multiple',
        question: 'Welche Farbe hat das "Black Box" Flugschreiber?',
        answers: ['Schwarz', 'Orange', 'Rot', 'Gelb'],
        correct: 1
    },
    {
        question: "Welche Farbe hat ein Stopp-Schild?",
        answers: ["Rot", "Gelb", "Blau", "Grün"],
        correct: 0,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Beine hat eine Spinne?",
        answers: ["6", "8", "10", "12"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "In welchem Land steht der Eiffelturm?",
        answers: ["Italien", "Spanien", "Frankreich", "Deutschland"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier ist das größte Landsäugetier?",
        answers: ["Giraffe", "Nashorn", "Elefant", "Nilpferd"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Tage hat der Februar in einem Schaltjahr?",
        answers: ["28", "29", "30", "31"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe entsteht wenn man Blau und Gelb mischt?",
        answers: ["Grün", "Orange", "Lila", "Braun"],
        correct: 0,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt von Italien?",
        answers: ["Mailand", "Venedig", "Rom", "Florenz"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welcher Planet ist der Sonne am nächsten?",
        answers: ["Venus", "Merkur", "Erde", "Mars"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Minuten hat eine Stunde?",
        answers: ["50", "60", "70", "100"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier bellt?",
        answers: ["Katze", "Kuh", "Hund", "Pferd"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Aus welchem Land kommt Pizza ursprünglich?",
        answers: ["Frankreich", "Griechenland", "Spanien", "Italien"],
        correct: 3,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Zähne hat ein erwachsener Mensch normalerweise?",
        answers: ["28", "32", "36", "40"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe hat eine Banane wenn sie reif ist?",
        answers: ["Grün", "Gelb", "Rot", "Orange"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie nennt man ein junges Pferd?",
        answers: ["Kalb", "Lamm", "Fohlen", "Welpe"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "In welchem Ozean liegt Hawaii?",
        answers: ["Atlantik", "Indischer Ozean", "Pazifik", "Arktischer Ozean"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Seiten hat ein Würfel?",
        answers: ["4", "6", "8", "12"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier gibt Milch?",
        answers: ["Schwein", "Huhn", "Kuh", "Schaf"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt von Spanien?",
        answers: ["Barcelona", "Madrid", "Valencia", "Sevilla"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welche Form hat ein Fußball?",
        answers: ["Würfel", "Dreieck", "Kugel", "Pyramide"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Finger hat eine menschliche Hand?",
        answers: ["4", "5", "6", "10"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welcher Monat hat 31 Tage?",
        answers: ["Februar", "April", "Januar", "Juni"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier legt Eier?",
        answers: ["Hund", "Huhn", "Kuh", "Pferd"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt der größte Kontinent?",
        answers: ["Afrika", "Europa", "Asien", "Amerika"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe hat die Sonne?",
        answers: ["Rot", "Gelb", "Blau", "Grün"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Räder hat ein Fahrrad?",
        answers: ["1", "2", "3", "4"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier kann fliegen?",
        answers: ["Fisch", "Vogel", "Hund", "Katze"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt von England?",
        answers: ["Manchester", "Liverpool", "London", "Birmingham"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welche Jahreszeit kommt nach dem Frühling?",
        answers: ["Winter", "Herbst", "Sommer", "Frühherbst"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Buchstaben hat das deutsche Alphabet?",
        answers: ["24", "26", "28", "30"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier hat einen Rüssel?",
        answers: ["Giraffe", "Elefant", "Zebra", "Löwe"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Aus welcher Frucht wird Wein gemacht?",
        answers: ["Äpfel", "Trauben", "Orangen", "Bananen"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Kontinente gibt es?",
        answers: ["5", "6", "7", "8"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe entsteht wenn man Rot und Blau mischt?",
        answers: ["Orange", "Grün", "Lila", "Braun"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt von Deutschland?",
        answers: ["München", "Hamburg", "Berlin", "Köln"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier miaut?",
        answers: ["Hund", "Katze", "Maus", "Vogel"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Ecken hat ein Dreieck?",
        answers: ["2", "3", "4", "5"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welcher Wochentag kommt nach Montag?",
        answers: ["Mittwoch", "Dienstag", "Donnerstag", "Freitag"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier ist schwarz-weiß gestreift?",
        answers: ["Tiger", "Leopard", "Zebra", "Giraffe"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Augen hat ein Mensch?",
        answers: ["1", "2", "3", "4"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe hat ein klassischer Basketball?",
        answers: ["Weiß", "Orange", "Rot", "Gelb"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt von Österreich?",
        answers: ["Salzburg", "Wien", "Graz", "Innsbruck"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier kann im Wasser und an Land leben?",
        answers: ["Hund", "Katze", "Frosch", "Vogel"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Monate hat ein Jahr?",
        answers: ["10", "12", "14", "16"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welche Frucht ist rot und wächst auf Bäumen?",
        answers: ["Banane", "Apfel", "Orange", "Traube"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie nennt man den Partner der Königin?",
        answers: ["Prinz", "König", "Herzog", "Baron"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier hat einen langen Hals?",
        answers: ["Elefant", "Giraffe", "Zebra", "Löwe"],
        correct: 1,
        type: "multiple-choice"
    },
    {
        question: "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?",
        answers: ["9", "10", "11", "12"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welche Farbe hat Schnee?",
        answers: ["Weiß", "Blau", "Grau", "Gelb"],
        correct: 0,
        type: "multiple-choice"
    },
    {
        question: "Wie heißt die Hauptstadt der Schweiz?",
        answers: ["Zürich", "Genf", "Bern", "Basel"],
        correct: 2,
        type: "multiple-choice"
    },
    {
        question: "Welches Tier gibt Wolle?",
        answers: ["Kuh", "Schwein", "Schaf", "Ziege"],
        correct: 2,
        type: "multiple-choice"
    },
];

// Shuffle questions on loads
const QUESTIONS = shuffleArray(QUESTIONS_POOL);

console.log('📝 Fragen wurden gemischt! Erste Frage:', QUESTIONS[0]?.question);
console.log('📊 Gesamt Fragen:', QUESTIONS.length, '(Alle Multiple Choice)');
console.log('🎯 Frage-Typen:', QUESTIONS.filter(q => q.type === 'multiple').length, 'Multiple Choice');

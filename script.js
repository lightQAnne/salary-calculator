function calculate() {
    // Pobieramy wartości z pól input i zabezpieczamy przed ujemnymi liczbami
    let godzinyPracyInput = document.getElementById("godziny").value.replace(',', '.');
	let godzinyPracy = /^[0-9]*\.?[0-9]+$/.test(godzinyPracyInput) ? parseFloat(godzinyPracyInput) : 0;
    let zamowienia = Math.max(parseFloat(document.getElementById("zamowienia").value) || 0, 0);
    let napiwki = Math.max(parseFloat(document.getElementById("napiwki").value) || 0, 0);
    let paliwo = Math.max(parseFloat(document.getElementById("paliwo").value) || 0, 0);
    let parking = Math.max(parseFloat(document.getElementById("parking").value) || 0, 0);
    let jedzenie = Math.max(parseFloat(document.getElementById("jedzenie").value) || 0, 0);

    // Obliczenia
    let wynagrodzenieZaGodziny = godzinyPracy * 30.50;
    let zaZamowienia = zamowienia * 5.50;
    let sumaZarobkow = wynagrodzenieZaGodziny + napiwki + zaZamowienia;
	
	// Składka zdrowotna (9%)
	let skladkaZdrowotna = sumaZarobkow * 0.09; // Składka zdrowotna (9%)

	// Wynagrodzenie netto po odliczeniu składki zdrowotnej
	let netto = sumaZarobkow - skladkaZdrowotna;
	
    let sumaWydatkow = paliwo + parking + jedzenie;
	
	let lacznie = netto - sumaWydatkow;

    // Wyświetlanie wyników
    document.getElementById("wynagrodzenie").innerText = "Wynagrodzenie za godziny: " + wynagrodzenieZaGodziny.toFixed(2) + " PLN";
    document.getElementById("bonusy").innerText = "Za zamówienia: " + zaZamowienia.toFixed(2) + " PLN";
    document.getElementById("sumZarobkow").innerText = "Suma zarobków: " + sumaZarobkow.toFixed(2) + " PLN";
    document.getElementById("netto").innerText = "Netto (po opodatkowaniu): " + netto.toFixed(2) + " PLN";
    document.getElementById("sumWydatkow").innerText = "Suma wydatków: " + sumaWydatkow.toFixed(2) + " PLN";
    document.getElementById("laczenie").innerText = "Łącznie: " + lacznie.toFixed(2) + " PLN";
}
function calculate() {
    // Pobieramy wartości z pól input i zabezpieczamy przed ujemnymi liczbami
    let godzinyPracy = parseFloat(document.getElementById("godziny").value.replace(',', '.')) || 0;
    let zamowienia = Math.max(parseFloat(document.getElementById("zamowienia").value) || 0, 0);
    let napiwki = Math.max(parseFloat(document.getElementById("napiwki").value) || 0, 0);
    let stawkaGodzinowa = parseFloat(document.getElementById("stawka_godz").value) || 30.50;
    let stawkaZamowienia = parseFloat(document.getElementById("stawka_zam").value) || 5.50;
	let paliwo = Math.max(parseFloat(document.getElementById("paliwo").value) || 0, 0);
    let parking = Math.max(parseFloat(document.getElementById("parking").value) || 0, 0);
    let jedzenie = Math.max(parseFloat(document.getElementById("jedzenie").value) || 0, 0);

    // Obliczenia
    let wynagrodzenieZaGodziny = godzinyPracy * stawkaGodzinowa;
    let zaZamowienia = zamowienia * stawkaZamowienia;
    let sumaZarobkow = wynagrodzenieZaGodziny + napiwki + zaZamowienia;
    let skladkaZdrowotna = sumaZarobkow * 0.09; // Składka zdrowotna (9%)
    let sumaNetto = sumaZarobkow - skladkaZdrowotna; // Wynagrodzenie netto po odliczeniu składki zdrowotnej
    let sumaWydatkow = paliwo + parking + jedzenie;
    let lacznie = sumaNetto - sumaWydatkow;

    // Wyświetlanie wyników
    document.getElementById("wynagrodzenie_godziny").innerText = wynagrodzenieZaGodziny.toFixed(2) + " PLN";
    document.getElementById("za_zamowienia").innerText = zaZamowienia.toFixed(2) + " PLN";
    document.getElementById("suma_brutto").innerText = sumaZarobkow.toFixed(2) + " PLN";
    document.getElementById("suma_netto").innerText = sumaNetto.toFixed(2) + " PLN";
    document.getElementById("suma_wydatkow").innerText = sumaWydatkow.toFixed(2) + " PLN";
    document.getElementById("laczenie").innerText = lacznie.toFixed(2) + " PLN";
}

 document.addEventListener("input", calculate);

// Zmienne globalne
let checkboxPas = false;
let checkboxToaleta = false;
let showSummary = false;
let selectedSeat = null;
let seats = [];
let logoImg;
let sadBgImg; // Add this new variable

// Zmienne dla powiadomień web
let notificationY = -100;
let targetNotificationY = 0;
let notificationStage = 1;
let showWebNotification = false;
let showSadness = false;
let notificationTimer = 0;

function preload() {
  // Ładowanie logo z GitHub
  logoImg = loadImage('https://raw.githubusercontent.com/cooqieez/rajansrer/refs/heads/main/logo_w.png');
  sadBgImg = loadImage('https://raw.githubusercontent.com/cooqieez/rajansrer/refs/heads/main/rajansrer-turbulencje-min.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupSeats();
}

function setupSeats() {
  // Funkcja do prawidłowego pozycjonowania miejsc
  seats = [];
  
  // Obliczanie pozycji względem kontenera
  let containerWidth = width * 0.85;
  let containerHeight = height * 0.75;
  let containerX = (width - containerWidth) / 2;
  let containerY = height * 0.12;
  
  // Sekcja miejsc w kontenerze - wycentrowana
  let seatAreaWidth = containerWidth * 0.6;
  let seatAreaHeight = containerHeight * 0.3;
  seatAreaWidth = min(seatAreaWidth, 600); // Maksymalna szerokość sekcji miejsc
  seatAreaHeight = min(seatAreaHeight, 300); // Maksymalna wysokość sekcji miejsc
  seatAreaWidth = max(seatAreaWidth, 300); // Minimalna szerokość sekcji miejsc
  seatAreaHeight = max(seatAreaHeight, 150); // Minimalna wysokość sekcji miejsc
  let seatStartX = containerX + (containerWidth - seatAreaWidth) / 2;
  let seatStartY = containerY + containerHeight * 0.15;
  
  for (let section = 0; section < 4; section++) {
    for (let seat = 0; seat < 6; seat++) {
      seats.push({
        x: seatStartX + seat * (seatAreaWidth / 6),
        y: seatStartY + section * (seatAreaHeight / 4),
        occupied: random() > 0.7,
        section: section + 1,
        number: seat + 1
      });
    }
  }
}

function draw() {
  background(246, 246, 246); // Add this line for a consistent background
  drawResponsiveHeader();
  
  if (!showSummary) {
    drawResponsiveBlueContainer();
    drawResponsiveContinueButton();
  } else {
    drawResponsiveSummary();
  }
  
  if (showWebNotification) {
    drawWebNotification();
  }
}

function drawResponsiveHeader() {
  background(246, 246, 246);

  // Draw yellow bar at the top
  fill(7, 53, 144); // bright yellow
  noStroke();
  rect(0, 0, width, 60);

  if (logoImg) {
    imageMode(CORNER);
    let barHeight = 60;
    let padding = 20;
    let logoHeight = barHeight - (padding * 2);
    let logoWidth = logoImg.width * (logoHeight / logoImg.height);
    // Zmieniamy pozycję x na padding, a y na padding
    image(logoImg, padding, padding, logoWidth, logoHeight);
  }
}

function drawResponsiveBlueContainer() {
  let containerWidth = width * 0.85;
  let containerHeight = height * 0.75;
  let containerX = (width - containerWidth) / 2;
  let containerY = height * 0.12;
  
  // Main container with stroke
  noFill();
  stroke(220, 220, 220);
  strokeWeight(2);
  fill(255, 255, 255, 200);
  drawRoundRect(containerX, containerY, containerWidth, containerHeight, 20);
  
  // Remove stroke for all content inside
  noStroke();
  
  // Title
  fill(7, 53, 144);
  textAlign(CENTER);
  textSize(constrain(width * 0.025, 16, 40));
  textStyle(BOLD);
  text("Dodatkowe opłaty", width/2, containerY + height * 0.05);
  
  drawResponsiveSeatSelection(containerX, containerY, containerWidth, containerHeight);
  drawResponsiveAbsurdQuestions(containerX, containerY, containerWidth, containerHeight);
}

function drawResponsiveSeatSelection(containerX, containerY, containerWidth, containerHeight) {
  // Tytuł sekcji z lepszym skalowaniem
  fill(241, 201, 51);
  textAlign(CENTER);
  textSize(constrain(width * 0.018, 12, 24));
  textStyle(NORMAL);
  text("Wybierz miejsce:", width/2, containerY + containerHeight * 0.12);
  
  // Rysowanie miejsc z poprawnym skalowaniem
  for (let i = 0; i < seats.length; i++) {
    let seat = seats[i];
    
    if (seat.occupied) {
      fill(7, 53, 144);
    } else if (selectedSeat === i) {
      fill(241, 201, 51);
    } else {
      fill(220, 220, 255);
    }
    
    // Responsywny rozmiar miejsc z ograniczeniami
    let seatWidth = constrain(containerWidth * 0.08, 25, 60);
    let seatHeight = seatWidth * 0.7;
    
    rect(seat.x, seat.y, seatWidth, seatHeight, 5);
    
    // Numer miejsca z odpowiednim rozmiarem czcionki
    fill(255);
    textAlign(CENTER);
    textSize(constrain(width * 0.01, 8, 14));
    text(seat.section + "-" + seat.number, 
         seat.x + seatWidth/2, 
         seat.y + seatHeight/2 + 3);
  }
  
  // Legenda z lepszym pozycjonowaniem
  drawSeatLegend(containerX, containerY, containerWidth, containerHeight);
}

function drawSeatLegend(containerX, containerY, containerWidth, containerHeight) {
  let legendY = containerY + containerHeight * 0.45;
  let legendSize = constrain(width * 0.02, 15, 30);
  let textSizeValue = constrain(width * 0.012, 10, 16);
  
  // Wycentrowana legenda z równymi odstępami
  let totalLegendWidth = containerWidth * 0.6;
  let legendSpacing = totalLegendWidth / 3;
  let startX = containerX + (containerWidth - totalLegendWidth) / 2 + legendSpacing/2;
  
  // Zajęte
  fill(100);
  rect(startX - legendSize/2, legendY, legendSize, legendSize * 0.75, 3);
  fill(7, 53, 144);
  textAlign(CENTER);
  textSize(textSizeValue);
  text("Zajęte", startX, legendY + height * 0.05);
  
  // Dostępne
  fill(220, 220, 255);
  rect(startX + legendSpacing - legendSize/2, legendY, legendSize, legendSize * 0.75, 3);
  fill(7, 53, 144);
  text("Dostępne", startX + legendSpacing, legendY + height * 0.05);
  
  // Wybrane
  fill(241, 201, 51);
  rect(startX + legendSpacing * 2 - legendSize/2, legendY, legendSize, legendSize * 0.75, 3);
  fill(7, 53, 144);
  text("Wybrane", startX + legendSpacing * 2, legendY + height * 0.05);
}

function drawResponsiveAbsurdQuestions(containerX, containerY, containerWidth, containerHeight) {
  let questionTextSize = constrain(width * 0.018, 12, 24);
  let answerTextSize = constrain(width * 0.015, 10, 20);
  let checkboxSize = constrain(width * 0.02, 15, 35);
  
  // Pierwsze pytanie
  fill(7, 53, 144);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(questionTextSize);
  text("Czy potrzebujesz pasa bezpieczeństwa?", width/2, containerY + containerHeight * 0.6);
  
  // Checkboxy dla pasa - lepsze pozycjonowanie
  let checkboxY = containerY + containerHeight * 0.65;
  let checkboxSpacing = containerWidth * 0.25;
  let centerX = width/2;
  
  // Add stroke for first safety belt checkbox
  stroke(7, 53, 144);
  strokeWeight(2);
  fill(checkboxPas ? color(241, 201, 51) : 255);
  rect(centerX - checkboxSpacing/2 - checkboxSize/2, checkboxY, checkboxSize, checkboxSize, 5);
  
  noStroke();
  fill(7, 53, 144);
  textAlign(CENTER);
  textSize(answerTextSize);
  text("Tak", centerX - checkboxSpacing/2, checkboxY + height * 0.06);
  
  // Add stroke for second safety belt checkbox
  stroke(7, 53, 144);
  strokeWeight(2);
  fill(!checkboxPas ? color(241, 201, 51) : 255);
  rect(centerX + checkboxSpacing/2 - checkboxSize/2, checkboxY, checkboxSize, checkboxSize, 5);
  
  noStroke();
  fill(7, 53, 144);
  text("Nie", centerX + checkboxSpacing/2, checkboxY + height * 0.06);
  
  // Drugie pytanie
  fill(7, 53, 144);
  textSize(questionTextSize);
  textStyle(BOLD);
  text("Czy planujesz korzystać z toalety?", width/2, containerY + containerHeight * 0.8);
  
  // Checkboxy dla toalety
  let checkboxY2 = containerY + containerHeight * 0.85;
  
  // Add stroke for first bathroom checkbox
  stroke(7, 53, 144);
  strokeWeight(2);
  fill(checkboxToaleta ? color(241, 201, 51) : 255);
  rect(centerX - checkboxSpacing/2 - checkboxSize/2, checkboxY2, checkboxSize, checkboxSize, 5);
  
  noStroke();
  fill(7, 53, 144);
  textAlign(CENTER);
  textSize(answerTextSize);
  text("Tak", centerX - checkboxSpacing/2, checkboxY2 + height * 0.06);
  
  // Add stroke for second bathroom checkbox
  stroke(7, 53, 144);
  strokeWeight(2);
  fill(!checkboxToaleta ? color(241, 201, 51) : 255);
  rect(centerX + checkboxSpacing/2 - checkboxSize/2, checkboxY2, checkboxSize, checkboxSize, 5);
  
  noStroke();
  fill(7, 53, 144);
  text("Nie", centerX + checkboxSpacing/2, checkboxY2 + height * 0.06);
}

function drawResponsiveContinueButton() {
  let buttonWidth = constrain(width * 0.12, 100, 200);
  let buttonHeight = constrain(height * 0.05, 35, 70);
  let buttonX = width - buttonWidth - width * 0.02;
  let buttonY = height - buttonHeight - height * 0.02;
  
  fill(255, 209, 0);
  drawRoundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
  fill(7, 53, 144);
  textAlign(CENTER);
  textSize(constrain(width * 0.016, 12, 20));
  text("Leć dalej!", buttonX + buttonWidth/2, buttonY + buttonHeight/2 + 5);
}

function drawResponsiveSummary() {
  fill(7, 53, 144);
  noStroke();
  textStyle(BOLD);
  textAlign(LEFT);
  textSize(constrain(width * 0.025, 18, 35));
  text("Podsumowanie", width * 0.05, height * 0.15);
  
  let total = 0;
  let y = height * 0.22;
  let lineHeight = constrain(height * 0.035, 25, 45);
  let textSizeValue = constrain(width * 0.016, 12, 22);
  
  textStyle(NORMAL);
  textSize(textSizeValue);
  text("Lot podstawowy: 99 PLN", width * 0.05, y);
  total += 99;
  y += lineHeight;
  
  if (selectedSeat !== null) {
    text("Wybór miejsca: 35 PLN", width * 0.05, y);
    total += 35;
    y += lineHeight;
  }
  
  if (checkboxPas) {
    text("Pas bezpieczeństwa: 50 PLN", width * 0.05, y);
    total += 50;
    y += lineHeight;
  }
  
  if (checkboxToaleta) {
    text("Korzystanie z toalety: 25 PLN", width * 0.05, y);
    total += 25;
    y += lineHeight;
  }
  
  text("Opłata za oddychanie: 15 PLN", width * 0.05, y);
  total += 15;
  y += lineHeight;
  
  text("Opłata za grawitację: 10 PLN", width * 0.05, y);
  total += 10;
  y += lineHeight;
  
  fill(241, 201, 51);
  textStyle(BOLD);
  textSize(constrain(width * 0.02, 16, 28));
  text("SUMA: " + total + " PLN", width * 0.05, y + lineHeight);
  
  // Przycisk powrotu
  let backButtonWidth = constrain(width * 0.1, 80, 150);
  let backButtonHeight = constrain(height * 0.05, 35, 60);
  fill(255, 209, 0);
  drawRoundRect(width * 0.05, height - backButtonHeight - height * 0.02, 
                backButtonWidth, backButtonHeight, 10);
  fill(7, 53, 144);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(constrain(width * 0.016, 12, 20));
  text("Powrót", width * 0.05 + backButtonWidth/2, 
       height - backButtonHeight/2 - height * 0.01);
}

function drawWebNotification() {
  // Wymiary powiadomienia - centered
  let notifWidth = constrain(width * 0.35, 300, 500);
  let notifHeight = constrain(height * 0.4, 250, 400);
  let notifX = (width - notifWidth) / 2;
  
  // Update target position to center vertically
  targetNotificationY = (height - notifHeight) / 2;
  
  // Smooth animation
  if (notificationY < targetNotificationY) {
    notificationY += (targetNotificationY - notificationY) * 0.1;
  }

  if (showSadness) {
    // Komunikat "TO SMUTNE..." - centered
    stroke(200, 0, 0);
    strokeWeight(2);
    
    // Draw background image
    if (sadBgImg) {
      push();
      imageMode(CORNER);
      // Draw image with some opacity
      tint(255, 220);
      image(sadBgImg, notifX, notificationY, notifWidth, notifHeight * 0.6);
      pop();
    }
    
    // Add semi-transparent overlay
    noStroke();
    fill(200, 0, 0, 100);
    rect(notifX, notificationY, notifWidth, notifHeight * 0.6, 12);
    
    // Text
    fill(255);
    textAlign(CENTER);
    textSize(constrain(width * 0.03, 18, 35));
    textStyle(BOLD);
    text("TO SMUTNE...", notifX + notifWidth/2, notificationY + notifHeight * 0.2);
    
    // Timer do zamknięcia
    notificationTimer++;
    if (notificationTimer > 120) {
      showWebNotification = false;
      showSadness = false;
      notificationTimer = 0;
      notificationStage = 1;
      notificationY = -100;
    }
  } else {
    // Main notification with yellow background
    fill(246, 246, 246);
    stroke(7, 53, 144);
    strokeWeight(2);
    drawRoundRect(notifX, notificationY, notifWidth, notifHeight, 12);
    
    // Header bar
    fill(7, 53, 144);
    noStroke();
    rect(notifX, notificationY, notifWidth, 30);
    
    // Warning icon and title
    fill(255);
    textAlign(LEFT);
    textSize(16);
    text("⚠️", notifX + 10, notificationY + 20);
    textSize(constrain(width * 0.018, 12, 18));
    textStyle(BOLD);
    text("Ostrzeżenie bezpieczeństwa", notifX + 40, notificationY + 20);
    
    // Close button
    textAlign(CENTER);
    textSize(14);
    text("✕", notifX + notifWidth - 15, notificationY + 20);
    
    // Content
    let contentY = notificationY + 50;
    let lineHeight = constrain(height * 0.025, 15, 25);
    
    fill(0); // Change text color to black for better contrast on yellow
    textAlign(LEFT);
    textSize(constrain(width * 0.014, 10, 16));
    textStyle(NORMAL);
    
    // Statistics
    text("Statystyki wypadków bez pasów:", notifX + 20, contentY);
    text("• 99.7% pasażerów lata do góry nogami", notifX + 20, contentY + lineHeight);
    text("• 847% wzrost ryzyka w chmurach", notifX + 20, contentY + lineHeight * 2);
    text("• 73% zamienia się w ptaki", notifX + 20, contentY + lineHeight * 3);
    
    // Question
    fill(220, 53, 69);
    textAlign(CENTER);
    textSize(constrain(width * 0.016, 11, 20));
    textStyle(BOLD);
    
    if (notificationStage === 1) {
      text("Nie chcesz żeby twoi bliscy", notifX + notifWidth/2, contentY + lineHeight * 5);
      text("byli bezpieczni?", notifX + notifWidth/2, contentY + lineHeight * 6);
    } else if (notificationStage === 2) {
      text("Nie zależy Ci na", notifX + notifWidth/2, contentY + lineHeight * 5);
      text("twoim zdrowiu?", notifX + notifWidth/2, contentY + lineHeight * 6);
    }
    
    // Buttons
    let buttonWidth = constrain(notifWidth * 0.35, 60, 100);
    let buttonHeight = constrain(notifHeight * 0.15, 25, 40);
    let buttonY = notificationY + notifHeight - buttonHeight - 20;
    
    // Yes button
    fill(7, 53, 14);
    noStroke();
    drawRoundRect(notifX + 20, buttonY, buttonWidth, buttonHeight, 6);
    fill(255);
    textAlign(CENTER);
    textSize(constrain(width * 0.014, 10, 16));
    text("TAK", notifX + 20 + buttonWidth/2, buttonY + buttonHeight/2 + 5);
    
    // No button
    fill(255, 209, 0);
    drawRoundRect(notifX + notifWidth - buttonWidth - 20, buttonY, buttonWidth, buttonHeight, 6);
    fill(255);
    text("NIE", notifX + notifWidth - buttonWidth/2 - 20, buttonY + buttonHeight/2 + 5);
  }
}

function drawRoundRect(x, y, w, h, r) {
  beginShape();
  vertex(x + r, y);
  vertex(x + w - r, y);
  quadraticVertex(x + w, y, x + w, y + r);
  vertex(x + w, y + h - r);
  quadraticVertex(x + w, y + h, x + w - r, y + h);
  vertex(x + r, y + h);
  quadraticVertex(x, y + h, x, y + h - r);
  vertex(x, y + r);
  quadraticVertex(x, y, x + r, y);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupSeats();
}

function mousePressed() {
  if (showWebNotification && !showSadness) {
    let notifWidth = constrain(width * 0.35, 300, 500);
    let notifHeight = constrain(height * 0.4, 250, 400);
    let notifX = (width - notifWidth) / 2; // Updated to match new centered position
    
    // Update the X button check
    if (mouseX > notifX + notifWidth - 25 && mouseX < notifX + notifWidth - 5 && 
        mouseY > notificationY + 5 && mouseY < notificationY + 25) {
      showWebNotification = false;
      notificationStage = 1;
      notificationY = -100;
      return;
    }
    
    let buttonWidth = constrain(notifWidth * 0.35, 60, 100);
    let buttonHeight = constrain(notifHeight * 0.15, 25, 40);
    let buttonY = notificationY + notifHeight - buttonHeight - 15;
    
    // Przycisk TAK
    if (mouseX > notifX + 15 && mouseX < notifX + 15 + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      // Zamknij powiadomienie i ustaw pas na TAK
      showWebNotification = false;
      notificationStage = 1;
      notificationY = -100;
      checkboxPas = true;
    }
    
    // Przycisk NIE
    if (mouseX > notifX + notifWidth - buttonWidth - 15 && 
        mouseX < notifX + notifWidth - 15 && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      
      if (notificationStage === 1) {
        // Przejdź do drugiego pytania
        notificationStage = 2;
      } else if (notificationStage === 2) {
        // Pokaż "TO SMUTNE..." i rozpocznij timer
        showSadness = true;
        notificationTimer = 0;
      }
    }
    
    return; // Nie obsługuj innych kliknięć gdy powiadomienie jest aktywne
  }
  
  // Główna logika - gdy powiadomienie nie jest aktywne
  if (!showSummary) {
    // Kliknięcie w miejsca
    for (let i = 0; i < seats.length; i++) {
      let seat = seats[i];
      let containerWidth = width * 0.85;
      let seatWidth = constrain(containerWidth * 0.08, 25, 60);
      let seatHeight = seatWidth * 0.7;
      
      if (mouseX > seat.x && mouseX < seat.x + seatWidth && 
          mouseY > seat.y && mouseY < seat.y + seatHeight && 
          !seat.occupied) {
        selectedSeat = i;
      }
    }
    
    // Pozycje checkboxów
    let containerY = height * 0.12;
    let containerHeight = height * 0.75;
    let containerWidth = width * 0.85;
    let centerX = width/2;
    let checkboxSpacing = containerWidth * 0.25;
    let checkboxSize = constrain(width * 0.02, 15, 35);
    
    // Checkboxy pasa - z powiadomieniem
    let checkboxY = containerY + containerHeight * 0.65;
    if (mouseX > centerX - checkboxSpacing/2 - checkboxSize/2 && 
        mouseX < centerX - checkboxSpacing/2 + checkboxSize/2 && 
        mouseY > checkboxY && mouseY < checkboxY + checkboxSize) {
      checkboxPas = true;
    }
    if (mouseX > centerX + checkboxSpacing/2 - checkboxSize/2 && 
        mouseX < centerX + checkboxSpacing/2 + checkboxSize/2 && 
        mouseY > checkboxY && mouseY < checkboxY + checkboxSize) {
      // Logika powiadomienia - gdy klikamy NIE
      if (checkboxPas) {
        // Jeśli było TAK, normalnie zmień na NIE
        checkboxPas = false;
      } else {
        // Jeśli już było NIE, pokaż powiadomienie NATYCHMIAST
        showWebNotification = true;
        notificationStage = 1;
        notificationY = -100; // Rozpocznij animację
      }
    }
    
    // Checkboxy toalety
    let checkboxY2 = containerY + containerHeight * 0.85;
    if (mouseX > centerX - checkboxSpacing/2 - checkboxSize/2 && 
        mouseX < centerX - checkboxSpacing/2 + checkboxSize/2 && 
        mouseY > checkboxY2 && mouseY < checkboxY2 + checkboxSize) {
      checkboxToaleta = true;
    }
    if (mouseX > centerX + checkboxSpacing/2 - checkboxSize/2 && 
        mouseX < centerX + checkboxSpacing/2 + checkboxSize/2 && 
        mouseY > checkboxY2 && mouseY < checkboxY2 + checkboxSize) {
      checkboxToaleta = false;
    }
    
    // Przycisk "Leć dalej!"
    let buttonWidth = constrain(width * 0.12, 100, 200);
    let buttonHeight = constrain(height * 0.05, 35, 70);
    let buttonX = width - buttonWidth - width * 0.02;
    let buttonY = height - buttonHeight - height * 0.02;
    
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      showSummary = true;
    }
  } else {
    // Przycisk powrotu
    let backButtonWidth = constrain(width * 0.1, 80, 150);
    let backButtonHeight = constrain(height * 0.05, 35, 60);
    if (mouseX > width * 0.05 && mouseX < width * 0.05 + backButtonWidth && 
        mouseY > height - backButtonHeight - height * 0.02 && mouseY < height - height * 0.02) {
      showSummary = false;
    }
  }
}

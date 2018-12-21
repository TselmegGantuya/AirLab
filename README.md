# AirLab

Airlab is een applicatie die gebouwd is voor gebruikers van de uhoo apparaten. Deze apparaten meten de luchhtkwaliteit en slaat per minuut 9 waardes op.
In de applicatie verwerken wij de 9 waardes in een simple en gerbuiksvriendelijk applicatie.
Zo heb je op de home pagina de mogelijk om een plattegrond te uploaden en daarop de virtuele apparaten te plaatsen en dan gelijk de actueele waardes te zien als je op een apparaat klikt.

# Installatie proces

Fork de code naar een eigen respository.
Zorg dat je deze binnen haalt op je laptop of pc in een lege map.
Zorg dat je een domein aan maakt binnen je pc.
Voer in de command line composer install uit zodat de applicatie de functionaliteiten van composer heeft.
Zet de juiste gegevens van jouw database in de .env file.
Voer php artisan migrate uit voor de juiste database gegevens.
Voer php artisan storage link uit om de storage data te krijgen.
Maak een user aan in de database.
Roep de volgende url aan voor data uit de uhoo database: "uhoo/data/records" & "uhoo/data/devices".

# Functioneel

In het dashboard heb je de volgende functies:
  - Een plattegrond
  - Statische data
  
Een plattegrond kan je uploaden. Op deze plattegrond kun je de devices die bij jou organisatie horen plaatsen waar je maar wilt door de locked button op unlocked te zetten.
Plaats je apparaten en zet de unlocked knop weer op locked. Als je nu op een bolletje (een apparaat klikt) krijg je all actueele data van dat device. De bolletjes hebben een gloed.
Dit kan rood, oranje of groen zijn. Als de waarde rood is, dan is er 1 of meerdere waardes gevaarlijk gemeten op dit device. Bij oranje is het niet gevaarlijk maar niet super goed. 
Bij groen is het allemaal goed. Ook kan je de plattegrond een naam geven of verwijderen. Je kan meerdere plattegronden uploaden voor bijvoorbeeld meerdere verdiepingen.

De statische data kun je zien als je op de knop rechtsboven met statische data klikt. Dan krijg je al jou apparaten te zien met dezelfde rood, oranje of groene waarde.

Bij profiel heb je als user de mogelijkheid om je naam, email en wachtwoord aan te passen.

Als admin kan je bij profiel een plattegrond voor een ander bedrijf uploaden, een gebruiker aanmaken voor een andere bedrijf en gebruikers aan passen voor een bedrijf.

Als laatse de devices pagina. Hier kan je als user de data zien van afgelopen tijd. Als admin kan je apparaten toewijzen aan organizaties en verwijderen van organizaties.
